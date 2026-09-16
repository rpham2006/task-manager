from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Boolean, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

DB_PATH = Path(__file__).parent / "tasks.db"
engine = create_engine(f"sqlite:///{DB_PATH}")


class Base(DeclarativeBase):
    pass


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    done: Mapped[bool] = mapped_column(Boolean, default=False)


Base.metadata.create_all(engine)


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    done: bool | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    done: bool

    model_config = {"from_attributes": True}


app = FastAPI(title="Task Manager")


def get_task_or_404(session: Session, task_id: int) -> Task:
    task = session.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task


@app.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate):
    with Session(engine) as session:
        task = Task(title=payload.title)
        session.add(task)
        session.commit()
        session.refresh(task)
        return task


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    with Session(engine) as session:
        return list(session.query(Task).order_by(Task.id))


@app.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: int):
    with Session(engine) as session:
        return get_task_or_404(session, task_id)


@app.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate):
    with Session(engine) as session:
        task = get_task_or_404(session, task_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(task, field, value)
        session.commit()
        session.refresh(task)
        return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    with Session(engine) as session:
        task = get_task_or_404(session, task_id)
        session.delete(task)
        session.commit()
