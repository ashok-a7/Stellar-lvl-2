#![cfg(test)]
use super::*;
use soroban_sdk::{Env, String};

#[test]
fn test_add_task() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let id = client.add_task(&String::from_str(&env, "Buy groceries"));
    assert_eq!(id, 1);

    let task = client.get_task(&1);
    assert_eq!(task.description, String::from_str(&env, "Buy groceries"));
    assert_eq!(task.completed, false);
}

#[test]
fn test_multiple_tasks() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let id1 = client.add_task(&String::from_str(&env, "Task A"));
    let id2 = client.add_task(&String::from_str(&env, "Task B"));
    let id3 = client.add_task(&String::from_str(&env, "Task C"));

    assert_eq!(id1, 1);
    assert_eq!(id2, 2);
    assert_eq!(id3, 3);
    assert_eq!(client.get_task_count(), 3);
}

#[test]
fn test_complete_task() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.add_task(&String::from_str(&env, "Write code"));
    assert_eq!(client.get_task(&1).completed, false);

    client.complete_task(&1);
    let task = client.get_task(&1);
    assert_eq!(task.completed, true);
}

#[test]
fn test_delete_task() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.add_task(&String::from_str(&env, "Task to delete"));
    assert_eq!(client.get_task_count(), 1);

    client.delete_task(&1);
    assert_eq!(client.get_task_count(), 0);
}

#[test]
#[should_panic(expected = "task not found")]
fn test_get_deleted_task() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.add_task(&String::from_str(&env, "Temp task"));
    client.delete_task(&1);
    client.get_task(&1);
}

#[test]
fn test_permissionless_anyone_can_act() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    // No auth needed — fully permissionless
    client.add_task(&String::from_str(&env, "Anyone can add this"));
    client.complete_task(&1);
    assert_eq!(client.get_task(&1).completed, true);

    client.add_task(&String::from_str(&env, "Anyone can delete this"));
    client.delete_task(&2);
    assert_eq!(client.get_task_count(), 1);
}

#[test]
#[should_panic(expected = "task not found")]
fn test_complete_nonexistent() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.complete_task(&999);
}

#[test]
#[should_panic(expected = "task not found")]
fn test_delete_nonexistent() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.delete_task(&999);
}
