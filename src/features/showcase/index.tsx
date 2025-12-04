import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Modal, AppLoader } from "@/shared/components/custom";
import { 
  Heart, 
  Trash2, 
  Check, 
  Mail, 
  Lock, 
  Search,
  Download,
  Share2 
} from "lucide-react";

const ComponentsShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary-40 to-primary-60 bg-clip-text text-transparent mb-4">
            Components Showcase
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our custom-designed components
          </p>
        </motion.div>

        {/* Buttons Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">🔘</span>
              Buttons
            </h2>

            {/* Variants */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger" icon={<Trash2 className="w-5 h-5" />}>
                    Delete
                  </Button>
                  <Button variant="success" icon={<Check className="w-5 h-5" />}>
                    Confirm
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="primary" 
                    icon={<Download className="w-5 h-5" />}
                  >
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={<Share2 className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Share
                  </Button>
                  <Button 
                    variant="success" 
                    icon={<Heart className="w-5 h-5" />}
                  >
                    Like
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" loading>Loading...</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Inputs Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">📝</span>
              Inputs
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Default Variant */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="w-5 h-5" />}
                hint="We'll never share your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Filled Variant */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                variant="filled"
                leftIcon={<Lock className="w-5 h-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Outline Variant */}
              <Input
                label="Search"
                variant="outline"
                placeholder="Search tokens..."
                leftIcon={<Search className="w-5 h-5" />}
              />

              {/* With Error */}
              <Input
                label="Username"
                placeholder="Choose a username"
                error="Username is already taken"
              />

              {/* With Success */}
              <Input
                label="Referral Code"
                placeholder="Enter code"
                success="Valid referral code!"
              />

              {/* Full Width */}
              <Input
                label="Description"
                placeholder="Tell us about yourself"
                fullWidth
              />
            </div>
          </div>
        </motion.section>

        {/* Modal Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">🪟</span>
              Modals
            </h2>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="md"
              footer={
                <div className="flex gap-4 justify-end">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This is an example modal with custom styling, backdrop blur, and smooth animations.
                </p>
                <Input
                  label="Name"
                  placeholder="Enter your name"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
            </Modal>
          </div>
        </motion.section>

        {/* Loader Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">⏳</span>
              Loaders
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-12">
                  <AppLoader fullScreen={false} size="sm" text="Small" />
                  <AppLoader fullScreen={false} size="md" text="Medium" />
                  <AppLoader fullScreen={false} size="lg" text="Large" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Full Screen</h3>
                <Button variant="primary" onClick={() => {
                  setShowLoader(true);
                  setTimeout(() => setShowLoader(false), 3000);
                }}>
                  Show Full Screen Loader (3s)
                </Button>
                {showLoader && <AppLoader text="Loading your data..." />}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Color Palette */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">🎨</span>
              Color Palette
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Primary 40", color: "bg-primary-40" },
                { name: "Primary 50", color: "bg-primary-50" },
                { name: "Primary 60", color: "bg-primary-60" },
                { name: "Success", color: "bg-success-40" },
                { name: "Error", color: "bg-error-40" },
                { name: "Warning", color: "bg-warning-40" },
                { name: "Gray 70", color: "bg-gray-70" },
                { name: "Gray 90", color: "bg-gray-90" },
              ].map((item) => (
                <div key={item.name} className="text-center">
                  <div className={`${item.color} h-24 rounded-xl shadow-lg mb-2`} />
                  <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ComponentsShowcase;

