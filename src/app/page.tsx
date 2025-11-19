import { useContext } from "react";
import Button from "./components/button";
import { AppProvider } from "./contexts/appContext";
import PalapaList from "./components/palapaList";
import ResponseMessage from "./components/responseMessage";
import UserInfo from "./components/userInfo";
import ActionButtons from "./components/actionButtons";
import { CurrentTime } from "./components/currentTime";

export default function Home() {
  return (
    <main>
      <AppProvider>
        <div className="flex min-h-screen w-full flex-col items-start justify-start gap-y-4 p-5 lg:p-24">
          <UserInfo />
          <CurrentTime />
          <ActionButtons />
        </div>
      </AppProvider>
    </main>
  );
}
