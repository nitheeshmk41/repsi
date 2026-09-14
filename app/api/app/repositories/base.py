from typing import TypeVar, Generic, Type, Optional, List, Any
from sqlalchemy.orm import Session
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseTenantRepository(Generic[ModelType]):
    """
    Abstract Base Repository that enforces multi-tenant database isolation.
    Every query is strictly constrained to workspace_id.
    """
    def __init__(self, model: Type[ModelType], db: Session, workspace_id: str):
        self.model = model
        self.db = db
        self.workspace_id = workspace_id

    def scoped_query(self):
        return self.db.query(self.model).filter(self.model.workspace_id == self.workspace_id)

    def get(self, id: Any) -> Optional[ModelType]:
        return (
            self.scoped_query()
            .filter(self.model.id == id)
            .first()
        )

    def get_multi(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return (
            self.db.query(self.model)
            .filter(self.model.workspace_id == self.workspace_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self) -> int:
        return (
            self.db.query(self.model)
            .filter(self.model.workspace_id == self.workspace_id)
            .count()
        )

    def create(self, **kwargs) -> ModelType:
        # Enforce workspace assignment
        kwargs["workspace_id"] = self.workspace_id
        db_obj = self.model(**kwargs)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, **kwargs) -> ModelType:
        # Prevent overriding workspace_id
        kwargs.pop("workspace_id", None)
        for field, value in kwargs.items():
            if value is not None and hasattr(db_obj, field):
                setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def remove(self, id: Any) -> Optional[ModelType]:
        obj = self.get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
