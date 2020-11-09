import Head from "next/head";
import TaskList from "../components/TaskList";
import { initializeApollo } from "../lib/client";
import { TasksDocument, TasksQuery, useTasksQuery } from "../generated/graphql-frontend";

export default function Home() {
  const result = useTasksQuery();
  const tasks = result.data?.tasks;

  return (
    <div>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {result.loading ? <p> Loading... </p> : result.error ? <p> An Error Occurred </p> : tasks && tasks.length > 0 ? <TaskList tasks={tasks} /> : <p className="no-tasks-message"> No Tasks </p>}
    </div>
  );
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query<TasksQuery>({
    query: TasksDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
