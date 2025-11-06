"""
Daily Plan API Router

This module provides API endpoints for generating daily plans using the CrewAI agent.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel

from app.database import get_db
from app.auth import get_current_active_user
from app.models import User


class DailyPlanRequest(BaseModel):
    """Request model for daily plan generation."""
    target_date: Optional[str] = None  # ISO format date string (YYYY-MM-DD)


class DailyPlanResponse(BaseModel):
    """Response model for daily plan generation."""
    success: bool
    plan_content: str
    target_date: str
    generated_at: str
    message: Optional[str] = None


router = APIRouter(tags=["daily-plan"])


@router.post("/daily-plan", response_model=DailyPlanResponse)
def generate_daily_plan(
    request: DailyPlanRequest = DailyPlanRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a daily plan for the authenticated user.
    
    This endpoint uses CrewAI agents to analyze the user's tasks and dependencies,
    then generates a comprehensive daily plan formatted as markdown.
    """
    try:
        # Parse target date
        if request.target_date:
            try:
                target_date = datetime.fromisoformat(request.target_date)
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid date format. Use YYYY-MM-DD format."
                )
        else:
            target_date = datetime.now()
        
        # Import the plan agent (lazy import to avoid import errors if dependencies not installed)
        try:
            from app.plan_agent import generate_user_daily_plan
        except ImportError as e:
            raise HTTPException(
                status_code=500,
                detail="Daily plan generation service is not available. Please ensure CrewAI dependencies are installed."
            )
        
        # Generate the daily plan
        plan_content = generate_user_daily_plan(
            user_id=current_user.id,
            target_date=target_date
        )
        
        return DailyPlanResponse(
            success=True,
            plan_content=plan_content,
            target_date=target_date.strftime("%Y-%m-%d"),
            generated_at=datetime.now().isoformat(),
            message="Daily plan generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate daily plan: {str(e)}"
        )


@router.get("/daily-plan", response_model=DailyPlanResponse)
def get_daily_plan(
    target_date: Optional[str] = Query(None, description="Target date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a daily plan for the authenticated user (GET version).
    
    This is a convenience endpoint that works the same as the POST version
    but accepts the target date as a query parameter.
    """
    request = DailyPlanRequest(target_date=target_date)
    return generate_daily_plan(request, db, current_user)
