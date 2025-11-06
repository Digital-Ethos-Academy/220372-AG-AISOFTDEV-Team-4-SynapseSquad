from datetime import datetime
from fastapi.testclient import TestClient
from app import models


def _create_task(db, user_id: int, title: str):
    now = datetime.utcnow()
    task = models.Task(
        user_id=user_id,
        title=title,
        description=None,
        deadline=None,
        estimated_duration=None,
        status="pending",
        created_at=now,
        updated_at=now,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def test_create_and_duplicate_dependency(client: TestClient, db_session, default_user):
    # Arrange: create two tasks
    t1 = _create_task(db_session, default_user.id, "Task A")
    t2 = _create_task(db_session, default_user.id, "Task B")

    # Act: create dependency
    resp1 = client.post("/api/tasks_dependencies", json={"task_id": t1.id, "depends_on_task_id": t2.id})
    assert resp1.status_code == 200, resp1.text
    data1 = resp1.json()
    assert data1["task_id"] == t1.id
    assert data1["depends_on_task_id"] == t2.id

    # Duplicate create should yield 409 Conflict
    resp2 = client.post("/api/tasks_dependencies", json={"task_id": t1.id, "depends_on_task_id": t2.id})
    assert resp2.status_code == 409
    assert "already exists" in resp2.text

    # Self dependency attempt
    resp3 = client.post("/api/tasks_dependencies", json={"task_id": t1.id, "depends_on_task_id": t1.id})
    assert resp3.status_code == 400
    assert "cannot depend on itself" in resp3.text
