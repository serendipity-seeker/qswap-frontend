import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Modal, AppLoader } from "@/shared/components/custom";
import { Heart, Trash2, Check, Mail, Lock, Search, Download, Share2 } from "lucide-react";

const ComponentsShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="from-primary-40 to-primary-60 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent">
            Components Showcase
          </h1>
          <p className="text-muted-foreground text-xl">Explore our custom-designed components</p>
        </motion.div>

        {/* Buttons Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
              <span className="text-4xl">🔘</span>
              Buttons
            </h2>

            {/* Variants */}
            <div className="space-y-8">
              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger" icon={<Trash2 className="h-5 w-5" />}>
                    Delete
                  </Button>
                  <Button variant="success" icon={<Check className="h-5 w-5" />}>
                    Confirm
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                  <Button variant="primary" size="xl">
                    Extra Large
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" icon={<Download className="h-5 w-5" />}>
                    Download
                  </Button>
                  <Button variant="outline" icon={<Share2 className="h-5 w-5" />} iconPosition="right">
                    Share
                  </Button>
                  <Button variant="success" icon={<Heart className="h-5 w-5" />}>
                    Like
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" loading>
                    Loading...
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                  <Button variant="primary" fullWidth>
                    Full Width
                  </Button>
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
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
              <span className="text-4xl">📝</span>
              Inputs
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Default Variant */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="h-5 w-5" />}
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
                leftIcon={<Lock className="h-5 w-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Outline Variant */}
              <Input
                label="Search"
                variant="outline"
                placeholder="Search tokens..."
                leftIcon={<Search className="h-5 w-5" />}
              />

              {/* With Error */}
              <Input label="Username" placeholder="Choose a username" error="Username is already taken" />

              {/* With Success */}
              <Input label="Referral Code" placeholder="Enter code" success="Valid referral code!" />

              {/* Full Width */}
              <Input label="Description" placeholder="Tell us about yourself" fullWidth />
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
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
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
                <div className="flex justify-end gap-4">
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
                <Input label="Name" placeholder="Enter your name" />
                <Input label="Email" type="email" placeholder="Enter your email" />
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
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
              <span className="text-4xl">⏳</span>
              Loaders
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Sizes</h3>
                <div className="flex flex-wrap items-center gap-12">
                  <AppLoader fullScreen={false} size="sm" text="Small" />
                  <AppLoader fullScreen={false} size="md" text="Medium" />
                  <AppLoader fullScreen={false} size="lg" text="Large" />
                </div>
              </div>

              <div>
                <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Full Screen</h3>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowLoader(true);
                    setTimeout(() => setShowLoader(false), 3000);
                  }}
                >
                  Show Full Screen Loader (3s)
                </Button>
                {showLoader && <AppLoader text="Loading your data..." />}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Color Palette */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
              <span className="text-4xl">🎨</span>
              Color Palette
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                  <div className={`${item.color} mb-2 h-24 rounded-xl shadow-lg`} />
                  <p className="text-muted-foreground text-sm font-medium">{item.name}</p>
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
