import { Outlet } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useAuthApi } from "../hooks/useAuth";
import Loader from "../components/UtilsComponents/Loader";

const RootLayout = () => {
  const { isLoading, isError, error } = useAuthApi();

  if (isError) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-white">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-6">
          <SignIn
          />
        </div>
      </SignedOut>

      <SignedIn>
        {/* Keep Nav in normal flow (or sticky) */}

        {isLoading ? (
          <div className="w-screen h-screen flex items-center justify-center">
            <Loader text={"Signing in"} size={20} />
          </div>
        ) : (
          <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
              <Nav />
            </header>

            <main className="w-full">
              <Outlet />
            </main>
          </>
        )}
      </SignedIn>
    </div>
  );
};

export default RootLayout;
