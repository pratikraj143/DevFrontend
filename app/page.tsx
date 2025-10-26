"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const BACKEND_URL = "https://assignment-0gmw.onrender.com";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [pat, setPat] = useState("");
  const [dockerfile, setDockerfile] = useState("");
  const [buildOutput, setBuildOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "generated" | "built">("idle");

  // 🔹 Handle Dockerfile Generation
  const handleGenerate = async () => {
    if (!repoUrl) return alert("Enter a GitHub repository URL");

    setLoading(true);
    setDockerfile("");
    setBuildOutput("");
    setStep("idle");

    try {
      const headers: Record<string, string> = {};
      if (pat) headers.Authorization = `token ${pat}`;

      const response = await axios.post(
        `${BACKEND_URL}/generate-dockerfile`,
        { repoUrl, useAI: true },
        { headers }
      );

      setDockerfile(response.data.dockerfile);
      setStep("generated");
    } catch (error: any) {
      console.error(error);
      alert("Failed to generate Dockerfile: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Docker Image Build
  const handleBuild = async () => {
    if (!repoUrl) return alert("Generate Dockerfile first");

    const repoName = repoUrl.split("/").pop()?.replace(".git", "");
    const imageName = repoName?.toLowerCase() + ":latest";

    setLoading(true);
    setBuildOutput("");

    try {
      const response = await axios.post(`${BACKEND_URL}/build-image`, {
        repoName,
        imageName,
      });

      setBuildOutput(response.data.output);
      setStep("built");
    } catch (error: any) {
      console.error(error);
      alert("Docker build failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">
            🚀 DockGen AI – Dockerfile Generator
          </CardTitle>
          <p className="text-gray-500 mt-2">
            AI-powered tool to generate and build Docker images from JS projects
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Input
              placeholder="Enter GitHub Repository URL (e.g. https://github.com/user/project)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter Personal Access Token (PAT) — optional for private repos"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                "Generate Dockerfile"
              )}
            </Button>

            {step === "generated" && (
              <Button
                variant="secondary"
                onClick={handleBuild}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building...
                  </>
                ) : (
                  "Build Docker Image"
                )}
              </Button>
            )}
          </div>

          {/* Generated Dockerfile Display */}
          {dockerfile && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">🧩 Generated Dockerfile</h2>
              <Textarea value={dockerfile} readOnly className="h-64 font-mono bg-gray-100" />
            </div>
          )}

          {/* Build Output Display */}
          {buildOutput && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">🛠️ Docker Build Output</h2>
              <Textarea value={buildOutput} readOnly className="h-64 font-mono bg-gray-900 text-green-400" />
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="mt-6 text-sm text-gray-500">
        Built with ❤️ using Next.js, Shadcn/UI, and OpenAI/Gemini
      </footer>
    </div>
  );
}
