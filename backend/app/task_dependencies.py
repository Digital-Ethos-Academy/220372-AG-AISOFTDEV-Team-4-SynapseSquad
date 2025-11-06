from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, crud, models
from app.database import get_db
from app.auth import get_current_active_user

router = APIRouter(tags=["task-dependencies"])


@router.get("/tasks_dependencies", response_model=List[schemas.TaskDependency])
def list_deps(
    task_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """List task dependencies for the authenticated user.

    If task_id is provided, limit to dependencies where the task participates.
    """
    print("Task Dependencies - list_deps called")
    print(f"User authenticated: {current_user.id}")
    if task_id is not None:
        return crud.get_task_dependencies_for_task(db, task_id)
    return crud.get_task_dependencies(db)


@router.post("/tasks_dependencies", response_model=schemas.TaskDependency)
def create_dep(dep: schemas.TaskDependencyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    try:
        return crud.create_task_dependency(db, dep)
    except ValueError as ve:
        # Differentiate duplicate vs generic validation
        msg = str(ve)
        if "already exists" in msg.lower():
            raise HTTPException(status_code=409, detail=msg)
        raise HTTPException(status_code=400, detail=msg)
    except Exception as e:
        # Unexpected database errors
        raise HTTPException(status_code=500, detail="Failed to create dependency") from e
