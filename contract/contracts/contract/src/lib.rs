#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Task {
    pub description: String,
    pub completed: bool,
}

#[contracttype]
pub enum DataKey {
    Count,
    LastId,
    Task(u64),
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn add_task(env: Env, description: String) -> u64 {
        let last_id: u64 = env.storage().instance().get(&DataKey::LastId).unwrap_or(0);
        let count: u64 = env.storage().instance().get(&DataKey::Count).unwrap_or(0);
        let id = last_id + 1;
        let task = Task {
            description: description.clone(),
            completed: false,
        };
        env.storage().persistent().set(&DataKey::Task(id), &task);
        env.storage().instance().set(&DataKey::LastId, &id);
        env.storage().instance().set(&DataKey::Count, &(count + 1));
        env.events()
            .publish((Symbol::new(&env, "task_added"), id), description);
        id
    }

    pub fn complete_task(env: Env, task_id: u64) {
        let mut task: Task = env
            .storage()
            .persistent()
            .get(&DataKey::Task(task_id))
            .expect("task not found");
        task.completed = true;
        env.storage()
            .persistent()
            .set(&DataKey::Task(task_id), &task);
        env.events()
            .publish((Symbol::new(&env, "task_completed"),), task_id);
    }

    pub fn delete_task(env: Env, task_id: u64) {
        env.storage()
            .persistent()
            .get::<_, Task>(&DataKey::Task(task_id))
            .expect("task not found");
        env.storage().persistent().remove(&DataKey::Task(task_id));
        let count: u64 = env.storage().instance().get(&DataKey::Count).unwrap_or(0);
        if count > 0 {
            env.storage().instance().set(&DataKey::Count, &(count - 1));
        }
        env.events()
            .publish((Symbol::new(&env, "task_deleted"),), task_id);
    }

    pub fn get_task(env: Env, task_id: u64) -> Task {
        env.storage()
            .persistent()
            .get(&DataKey::Task(task_id))
            .expect("task not found")
    }

    pub fn get_task_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::Count).unwrap_or(0)
    }
}

mod test;
