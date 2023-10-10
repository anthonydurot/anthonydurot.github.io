<!-- ---
layout: post
title: Mocking Vault client in Go
date: 2023-10-10 15:09:00
description: An explanation of how to deal with Vault in Go
tags: code
categories: sample-posts
featured: true
---


```go
package interfaces

import (
 "github.com/hashicorp/vault/api"
 "github.com/stretchr/testify/mock"
)

/*
This abstractions allows us to mock Vault interractions in our tests
*/

type VaultLogical interface {
 Read(path string) (*api.Secret, error)
 Write(path string, data map[string]interface{}) (*api.Secret, error)
 List(path string) (*api.Secret, error)
}

type VaultClient interface {
 Logical() VaultLogical
 WithNamespace(namespace string) VaultClient
}

// Vault is the real implementation of VaultClient interface

type Vault struct {
 client *api.Client
}

func (v *Vault) Logical() VaultLogical {
 return v.client.Logical()
}

func (v *Vault) WithNamespace(namespace string) VaultClient {
 return &Vault{
  client: v.client.WithNamespace(namespace),
 }
}

func NewVaultClient(client *api.Client) VaultClient {
 return &Vault{
  client: client,
 }
}

// MOCKS

type MockVaultClient struct {
 mock.Mock
 MockLogical *MockVaultLogical
}

type MockVaultLogical struct {
 mock.Mock
}

func (m *MockVaultClient) Logical() VaultLogical {
 return m.MockLogical
}

func (m *MockVaultClient) WithNamespace(namespace string) VaultClient {
 return m
}

func (m *MockVaultLogical) Read(path string) (*api.Secret, error) {
 args := m.Called(path)
 if args.Get(0) == nil {
  return nil, args.Error(1)
 }
 return args.Get(0).(*api.Secret), args.Error(1)
}

func (m *MockVaultLogical) Write(path string, data map[string]interface{}) (*api.Secret, error) {
 args := m.Called(path, data)
 if args.Get(0) == nil {
  return nil, args.Error(1)
 }
 return args.Get(0).(*api.Secret), args.Error(1)
}

func (m *MockVaultLogical) List(path string) (*api.Secret, error) {
 args := m.Called(path)
 if args.Get(0) == nil {
  return nil, args.Error(1)
 }
 return args.Get(0).(*api.Secret), args.Error(1)
}

``` -->
