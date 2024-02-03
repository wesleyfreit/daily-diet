## 💻 Project

### 📖 Title
**@daily-diet/api**

### 📝 Description
**The Daily Diet App API**

## 🚀 Quick Start

**Requirements: Node >=18**

---

**1. Install the project dependencies.**

**2. Set environment variables based on .env examples.**

**3. Run the server based on commands section.**

## ⌨️ Commands

**Run the install dependencies command**

```bash
pnpm i
```

**Run the development server command:**

```bash
pnpm run dev
```

**Run the test command:**

```bash
pnpm test
```

**Run the build command:**

```bash
pnpm run build
```

**Run the builded server command:**

```bash
pnpm start
```

**Run the linter code command:**

```bash
pnpm run lint
```

**Run the knex commands:**

```bash
pnpm run knex # cli command
pnpm run knex-dev # cli command for development environment
pnpm run knex migrate:make migration-name # create migration
pnpm run knex migrate:latest # insert all migrations created
pnpm run knex migrate: rollback --all # undo all migrations inserted
```

## 📝 Requirements

### 🛠️ Functional Requirements

- ✅ It must be possible to create a user

- ✅ It must be possible to create a meal with the following information:
  * Name
  * Description
  * DateTime
  * isDiet
  
- ✅ It must be possible to modify all data for a registered meal

- ✅ It must be possible to delete a meal

- ✅ It must be possible to list all of a user's meals

- ✅ It must be possible to get a specific meal

- ✅ It must be possible to get a user's metrics:
  * Total number of meals recorded
  * Total number of meals within the diet
  * Total number of non-diet meals
  * Best sequence of meals within the diet

### 📚 Business Rules

- ✅ The meals must be related for a user

- ✅ It must be possible to identify the user between requests

- ✅ The user can only view, modify and delete the meals that he has created
