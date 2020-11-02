import { ApolloServer, gql, IResolvers } from "apollo-server-micro";
import mysql from "serverless-mysql";

const typeDefs = gql`
  enum TaskStatus {
    active
    completed
  }

  type Task {
    id: Int!
    title: String!
    status: TaskStatus!
  }

  input CreateTaskInput {
    title: String!
  }

  input UpdateTaskInput {
    id: Int!
    title: String
    status: TaskStatus
  }

  type Query {
    tasks(status: TaskStatus): [Task!]!
    task(id: Int!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(input: UpdateTaskInput!): Task
    deleteTask(id: Int!): Task
  }
`;

interface ApolloContext {
  db: mysql.ServerlessMysql;
}

enum TaskStatus {
  active = "active",
  completed = "completed",
}

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

interface TaskDbRow {
  id: number;
  title: string;
  task_status: TaskStatus;
}

type TasksDbQueryResult = TaskDbRow[];

const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    async tasks(parent, args: { status?: TaskStatus }, context): Promise<Task[]> {
      const { status } = args;
      let query = "SELECT id, title, task_status FROM task";
      const queryParams: String[] = [];
      if (status) {
        query + " WHERE task_status = ?";
        queryParams.push(status);
      }
      const task = await context.db.query<TasksDbQueryResult>(query, [queryParams]);
      await db.end();
      return task.map(({ id, title, task_status }) => ({ id, title, status: task_status }));
    },
    task(parent, args, context) {
      return null;
    },
  },
  Mutation: {
    createTask(parent, args: { input: { title: string } }, context): Promise<Task> {
      return null;
    },
    updateTask(parent, args, context) {
      return null;
    },
    deleteTask(parent, args, context) {
      return null;
    },
  },
};

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
  },
});

const apolloServer = new ApolloServer({ typeDefs, resolvers, context: { db } });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
