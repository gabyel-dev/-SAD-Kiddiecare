import { useState, useEffect } from "react";
import { db } from "../db/db";

export function useChildren() {
  const [childrenCount, setChildrenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllChildren = async () => {
    try {
      return await db.children.toArray();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const refreshCount = async () => {
    try {
      const count = await db.children.count();
      setChildrenCount(count);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const add = async (child) => {
    setIsLoading(true);
    setError(null);
    try {
      await db.children.add(child);
      await refreshCount();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id, updatedChild) => {
    setIsLoading(true);
    try {
      await db.children.update(id, updatedChild);
      await refreshCount();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id) => {
    setIsLoading(true);
    try {
      await db.children.delete(id);
      await refreshCount();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCount();
  }, []);

  return {
    getAllChildren,
    childrenCount,
    add,
    update,
    remove,
    isLoading,
    error,
  };
}
