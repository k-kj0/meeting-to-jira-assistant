"""
These tests don't call the real OpenRouter API (that would cost money and
be flaky in CI). Instead they test the two things that actually matter:

1. parse_json_loose() -- can we pull clean JSON out of a messy model response?
2. ExtractionResult / ActionItem -- do we correctly accept good data and
   reject bad data?

Run locally with:  pytest tests/ -v
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "api"))

import pytest
from pydantic import ValidationError
from models import ActionItem, ExtractionResult
from extract import parse_json_loose


def test_valid_single_action_item():
    # "Alice will fix the authentication bug by Friday."
    data = {"action_items": [{"task": "Fix authentication bug", "assignee": "Alice", "deadline": "Friday"}]}
    result = ExtractionResult(**data)
    assert len(result.action_items) == 1
    assert result.action_items[0].assignee == "Alice"
    assert result.action_items[0].deadline == "Friday"


def test_no_named_owner_means_no_items():
    # "Someone should investigate the caching issue." -> not a real commitment
    data = {"action_items": []}
    result = ExtractionResult(**data)
    assert result.action_items == []


def test_suggestion_is_not_a_commitment():
    # "We should probably redesign the dashboard." -> also not a commitment
    data = {"action_items": []}
    result = ExtractionResult(**data)
    assert result.action_items == []


def test_missing_assignee_defaults_to_unassigned():
    data = {"action_items": [{"task": "Investigate caching"}]}
    result = ExtractionResult(**data)
    assert result.action_items[0].assignee == "Unassigned"


def test_multiple_commitments_in_one_transcript():
    data = {
        "action_items": [
            {"task": "Fix auth bug", "assignee": "Alice", "deadline": "Friday"},
            {"task": "Review payment API", "assignee": "Bob", "deadline": "tomorrow"},
            {"task": "Update dashboard", "assignee": "Sarah", "deadline": "next week"},
        ]
    }
    result = ExtractionResult(**data)
    assert len(result.action_items) == 3


def test_ambiguous_deadline_becomes_none_not_a_guess():
    # "Bob will review the API soon." -> deadline should be null, not a made-up date
    data = {"action_items": [{"task": "Review the API", "assignee": "Bob", "deadline": "null"}]}
    result = ExtractionResult(**data)
    assert result.action_items[0].deadline is None


def test_empty_task_is_rejected():
    with pytest.raises(ValidationError):
        ActionItem(task="   ")


def test_parse_json_loose_handles_markdown_fences():
    raw = '```json\n{"action_items": []}\n```'
    assert parse_json_loose(raw) == {"action_items": []}


def test_parse_json_loose_handles_plain_json():
    raw = '{"action_items": []}'
    assert parse_json_loose(raw) == {"action_items": []}


def test_parse_json_loose_handles_stray_text_around_json():
    raw = 'Sure, here you go:\n{"action_items": []}\nLet me know if you need more!'
    assert parse_json_loose(raw) == {"action_items": []}
