'use client';

import { useEffect, useState } from "react";
import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { fetchTodos, TodoType } from "@/data/todos";

export default function Page() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);

  // Filter & Pagination States (ตาม Architecture ของอาจารย์)
  const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [curPage, setCurPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  // Modal State สำหรับการเพิ่มรายการ
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");

  // 1. onLoad Fetching Data
  useEffect(() => {
    fetchTodos()
      .then((data) => {
        setTodosRaw(data as TodoType[]);
      })
      .catch((error) => {
        console.error(error);
        setTodosRaw([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. useEffect: [todosRaw, onlyWaiting] => todos
  useEffect(() => {
    const selectedItems = todosRaw.filter(
      (todo) => !onlyWaiting || !todo.completed
    );
    setTodos(selectedItems);
  }, [todosRaw, onlyWaiting]);

  // 3. useEffect: [todos, itemsPerPage] => numPages
  useEffect(() => {
    const calculatedPages = Math.ceil(todos.length / itemsPerPage);
    setNumPages(calculatedPages > 0 ? calculatedPages : 1);
  }, [todos, itemsPerPage]);

  // 4. useEffect: [numPages] => curPage
  useEffect(() => {
    if (numPages === 0) {
      setCurPage(0);
    } else if (curPage === 0) {
      setCurPage(1);
    } else if (curPage > numPages) {
      setCurPage(numPages);
    }
  }, [numPages]);

  // Handler: ปรับสถานะ Waiting -> Done
  const waitingClick = (id: number) => {
    const selectedItem = todosRaw.find((todo) => todo.id === id);
    if (selectedItem) {
      selectedItem.completed = !selectedItem.completed; // toggle สถานะ
      setTodosRaw([...todosRaw]); // force update
    }
  };

  // Handler: ลบรายการ
  const deleteClick = (id: number) => {
    setTodosRaw(todosRaw.filter((todo) => todo.id !== id));
  };

  // Handler: เพิ่มรายการใหม่
  const handleAddTodo = () => {
    if (!newTitle.trim()) return;

    // คำนวณ ID ใหม่แบบอัตโนมัติ
    const nextId = todosRaw.length > 0 ? Math.max(...todosRaw.map((t) => t.id)) + 1 : 1;
    const newTodo: TodoType = {
      userID: 1,
      id: nextId,
      title: newTitle.trim(),
      completed: false,
    };

    setTodosRaw([newTodo, ...todosRaw]);
    setNewTitle("");
    setIsModalOpen(false);
  };

  // ดึงรายการเฉพาะหน้าปัจจุบันสำหรับแสดงผล
  const startIndex = (curPage - 1) * itemsPerPage;
  const paginatedTodos = todos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-6 w-[700px] mx-auto font-sans relative">
      {/* คอนโทรลเลอร์ */}
      <div className="flex justify-between items-center mb-4">
        {/* Toggle with waiting badge */}
        <div className="flex items-center gap-2">
          <Toggle
            checked={onlyWaiting}
            onChange={(event) => setOnlyWaiting(event.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Show only</span>
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-md font-medium">
            Waiting
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>

        {/* Dropdown Items Per Page */}
        <div className="w-48">
          <NativeSelect
            value={itemsPerPage.toString()}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurPage(1);
            }}
          >
            <NativeSelectOption value="5">5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">10 items per page</NativeSelectOption>
            <NativeSelectOption value="50">50 items per page</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* Table */}
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
        <TableRoot className="w-full">
          <TableHeader className="bg-black text-white">
            <TableRow className="border-b-0 hover:bg-black">
              <TableHead className="text-white font-bold w-20 text-center">ID</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold text-right pr-4">
                <div className="flex items-center justify-end gap-2">
                  <span>Completed</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md flex items-center justify-center w-7 h-7 font-bold text-lg transition"
                    title="Add New Todo"
                  >
                    +
                  </button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Show Spinner */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Empty State */}
            {!isLoading && paginatedTodos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  No todos found
                </TableCell>
              </TableRow>
            )}

            {/* Display Items */}
            {!isLoading &&
              paginatedTodos.map((todo) => (
                <TableRow key={todo.id} className="border-b border-gray-100">
                  <TableCell className="text-center">
                    <span className="bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg inline-block min-w-[36px]">
                      {todo.id}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{todo.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {/* Button สลับสถานะ (waitingClick) */}
                      {todo.completed ? (
                        <button
                          onClick={() => waitingClick(todo.id)}
                          className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-md font-medium transition"
                        >
                          Done
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => waitingClick(todo.id)}
                          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-md font-medium transition"
                        >
                          Waiting
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}

                      {/* Button ลบรายการ (deleteClick) */}
                      <button
                        onClick={() => deleteClick(todo.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableRoot>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={curPage}
          totalPages={numPages}
          onPageChange={(page) => setCurPage(page)}
        />
      </div>

      {/* Modal Popup สำหรับการเพิ่ม Todo ใหม่ (ตามภาพสไลด์อาจารย์) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-blue-600">+</span> New todo
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  ID (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value={todosRaw.length > 0 ? Math.max(...todosRaw.map((t) => t.id)) + 1 : 1}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter todo title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                  className="w-full border border-blue-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}