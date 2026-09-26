"""
This file defines the exact shape a valid "action item" is allowed to have.

Why this exists (in plain English):
The AI model gives back text that is supposed to be JSON, in a specific shape.
Free models occasionally get it wrong: a missing field, the wrong type, or a
deadline like "the string null" instead of an actual empty value.

Instead of trusting whatever comes back, we check it against these rules.
If it doesn't match, we reject it with a clear error instead of quietly
creating a broken or nonsense GitHub Issue.
"""

from typing import Optional, List
from pydantic import BaseModel, field_validator


class ActionItem(BaseModel):
    task: str
    assignee: str = "Unassigned"
    deadline: Optional[str] = None

    @field_validator("task")
    @classmethod
    def task_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("task cannot be empty")
        return v

    @field_validator("deadline", mode="before")
    @classmethod
    def blank_deadline_is_none(cls, v):
        # Models sometimes send "" or the literal word "null" as a string
        # instead of a real empty value. Treat all of those as "no deadline".
        if v is None:
            return None
        if isinstance(v, str) and v.strip().lower() in ("", "null", "none", "n/a", "tbd"):
            return None
        return v


class ExtractionResult(BaseModel):
    action_items: List[ActionItem] = []
