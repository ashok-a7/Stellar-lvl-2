"use client";

import { useState, useCallback, useEffect } from "react";
import {
  addTask,
  completeTask,
  deleteTask,
  getTask,
  getTaskCount,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

interface TaskData {
  id: number;
  description: string;
  completed: boolean;
}

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const count = await getTaskCount();
      if (count === null) return;
      
      const loadedTasks: TaskData[] = [];
      // Note: This contract has a bug where IDs might be recycled or skipped if deleted.
      // We iterate up to the count as a heuristic, but a real app would need a better scan.
      for (let i = 1; i <= Number(count); i++) {
        try {
          const task = await getTask(i);
          if (task) {
            loadedTasks.push({ id: i, ...task });
          }
        } catch {
          // Task might have been deleted, skip
        }
      }
      setTasks(loadedTasks);
    } catch (err: unknown) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!newTaskDesc.trim()) return setError("Enter a description");
    setError(null);
    setIsAdding(true);
    setTxStatus("Awaiting signature...");
    try {
      await addTask(walletAddress, newTaskDesc.trim());
      setTxStatus("Task added to the blockchain!");
      setNewTaskDesc("");
      fetchTasks();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsAdding(false);
    }
  }, [walletAddress, newTaskDesc, fetchTasks]);

  const handleCompleteTask = useCallback(async (id: number) => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setTxStatus(`Completing task #${id}...`);
    try {
      await completeTask(walletAddress, id);
      setTxStatus("Task marked as completed!");
      fetchTasks();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    }
  }, [walletAddress, fetchTasks]);

  const handleDeleteTask = useCallback(async (id: number) => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setTxStatus(`Deleting task #${id}...`);
    try {
      await deleteTask(walletAddress, id);
      setTxStatus("Task deleted from blockchain!");
      fetchTasks();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    }
  }, [walletAddress, fetchTasks]);

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5">
              {error}
              {error.includes("Fund it via Friendbot") && (
                <a
                  href={`https://laboratory.stellar.org/#account-creator?network=testnet&account=${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block w-fit rounded-lg bg-[#f87171]/20 px-3 py-1.5 text-[10px] font-semibold text-[#f87171] hover:bg-[#f87171]/30 transition-all border border-[#f87171]/20"
                >
                  Fund with Friendbot →
                </a>
              )}
            </p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("blockchain") || txStatus.includes("completed") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Blockchain To-Do List</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Add Task Section */}
          <div className="p-6 border-b border-white/[0.06] bg-white/[0.01]">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/90 placeholder:text-white/15 outline-none focus:border-[#7c6cf0]/30 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                />
              </div>
              {walletAddress ? (
                <ShimmerButton onClick={handleAddTask} disabled={isAdding} shimmerColor="#7c6cf0" className="px-6">
                  {isAdding ? <SpinnerIcon /> : <><PlusIcon /> Add</>}
                </ShimmerButton>
              ) : (
                <ShimmerButton onClick={onConnect} disabled={isConnecting} shimmerColor="#7c6cf0" className="px-6">
                  Connect
                </ShimmerButton>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="p-6 min-h-[300px]">
            {isLoading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <SpinnerIcon />
                <p className="mt-4 text-xs font-mono">Syncing with Stellar...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/15">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20 mb-4">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No tasks found on-chain</p>
                <p className="text-[10px] mt-2 opacity-50">Add a task above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "group flex items-center justify-between rounded-xl border p-4 transition-all",
                      task.completed
                        ? "border-white/[0.02] bg-white/[0.01] opacity-60"
                        : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => !task.completed && handleCompleteTask(task.id)}
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                          task.completed
                            ? "bg-[#34d399] border-[#34d399] text-black"
                            : "border-white/20 hover:border-[#34d399]/50 text-transparent"
                        )}
                      >
                        <CheckIcon />
                      </button>
                      <div>
                        <p className={cn(
                          "text-sm font-medium transition-all",
                          task.completed ? "text-white/40 line-through" : "text-white/90"
                        )}>
                          {task.description}
                        </p>
                        <p className="text-[9px] font-mono text-white/20 mt-0.5">ID: {task.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between bg-white/[0.01]">
            <p className="text-[10px] text-white/15">Smart Contract managed by Soroban</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#7c6cf0]" />
                <span className="font-mono text-[9px] text-white/20">Total: {tasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#34d399]" />
                <span className="font-mono text-[9px] text-white/20">Done: {tasks.filter(t => t.completed).length}</span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
