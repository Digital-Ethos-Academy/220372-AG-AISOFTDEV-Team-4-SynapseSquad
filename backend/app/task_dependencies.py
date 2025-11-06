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


@router.delete("/tasks_dependencies/{dep_id}")
def delete_dep_by_id(dep_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    """Delete a task dependency by its ID."""
    success = crud.delete_task_dependency(db, dep_id)
    if not success:
        raise HTTPException(status_code=404, detail="Dependency not found")
    return {"message": "Dependency deleted successfully"}


@router.delete("/tasks_dependencies")
def delete_dep_by_tasks(
    task_id: int = Query(..., description="ID of the task that has the dependency"),
    depends_on_task_id: int = Query(..., description="ID of the task that is depended on"),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete a task dependency by task IDs."""
    success = crud.delete_task_dependency_by_tasks(db, task_id, depends_on_task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Dependency not found")
    return {"message": "Dependency deleted successfully"}
