import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./login-Form";
import RegisterForm from "./register-Form";

function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-sm border ">
        <h1 className="font-semibold  text-2xl text-center">Welcome!</h1>
        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full mb-4 grid-cols-2">
            <TabsTrigger value="login" className="w-full">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="w-full">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthLayout;