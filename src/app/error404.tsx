import { Link } from "react-router-dom";
import { Button } from "@/shared/components/custom";
import { Home } from "lucide-react";

const Error404: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-9xl font-black bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-2xl font-bold mt-4">Page Not Found</p>
        <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
      </div>
      <Link to="/">
        <Button variant="primary" icon={<Home className="w-5 h-5" />}>
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default Error404;

