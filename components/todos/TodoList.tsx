"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import CategoryManager from "../categories/CategoryManager";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  userId: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showStats, setShowStats] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const addCategory = async (name: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Kategori eklenirken bir hata oluştu");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Kategori silinirken bir hata oluştu");
    }
  };

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchTodos();
      fetchCategories();
    }
  }, [fetchTodos, fetchCategories, user, router, authLoading]);

  const addTodo = async (title: string, category: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
        }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Todo eklenirken bir hata oluştu");
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = async (
    id: string,
    newTitle: string,
    newCategory: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          completed: todos.find((t) => t._id === id)?.completed || false,
        }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      const updatedTodo = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Todo güncellenirken bir hata oluştu");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      !selectedCategory || todo.category === selectedCategory;
    const matchesCompletion = !hideCompleted || !todo.completed;
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCompletion && matchesSearch;
  });

  if (authLoading || loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-borderColor bg-background rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 border border-borderColor bg-background rounded-lg text-text">
                <input
                  type="checkbox"
                  id="hideCompleted"
                  checked={hideCompleted}
                  onChange={(e) => setHideCompleted(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hideCompleted" className="text-text font-medium">
                  Tamamlananları Gizle
                </label>
              </div>

              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center gap-2 px-4 py-2.5 border border-borderColor rounded-lg transition-colors ${
                  showStats ? "bg-button text-white" : "bg-background text-text hover:bg-button/10"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                İstatistikler
              </button>
            </div>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Görev ara..."
            className="w-full sm:w-auto flex-1 text-text rounded-lg border border-borderColor bg-transparent px-4 py-2.5 text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {showStats && (
        <div className="mb-8 p-6 bg-background rounded-xl border border-borderColor text-text shadow-sm">
          <h3 className="text-xl font-semibold mb-4">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-button/10 rounded-lg">
              <p className="text-sm text-button font-medium">Toplam Görev</p>
              <p className="text-2xl font-bold text-text">{todos.length}</p>
            </div>
            <div className="p-4 bg-button/10 rounded-lg">
              <p className="text-sm text-button font-medium">Tamamlanan</p>
              <p className="text-2xl font-bold text-text">
                {todos.filter((t) => t.completed).length}
              </p>
            </div>
            <div className="p-4 bg-button/10 rounded-lg">
              <p className="text-sm text-button font-medium">Aktif</p>
              <p className="text-2xl font-bold text-text">
                {todos.filter((t) => !t.completed).length}
              </p>
            </div>
            <div className="p-4 bg-button/10 rounded-lg">
              <p className="text-sm text-button font-medium">Kategoriler</p>
              <p className="text-2xl font-bold text-text">{categories.length}</p>
            </div>
          </div>
        </div>
      )}

      <CategoryManager
        categories={categories}
        onCategoryAdd={addCategory}
        onCategoryDelete={deleteCategory}
      />

      <div className="border border-borderColor rounded-xl p-6 shadow-sm">
        <AddTodo onAdd={addTodo} categories={categories} />

        {loading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Görev bulunamadı</div>
        ) : (
          <div className="space-y-4 mt-6">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                id={todo._id}
                title={todo.title}
                completed={todo.completed}
                category={todo.category}
                categories={categories}
                createdAt={todo.createdAt}
                updatedAt={todo.updatedAt}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
                onEdit={editTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
