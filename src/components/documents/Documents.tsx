import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Documents as HTDocuments } from "@/types/info";
import { ChevronRight } from "lucide-react";

export default function Documents({ docs }: { docs: HTDocuments }) {
  return (
    <div className="mx-5 my-6">
      <header className="mb-6">
        <h1 className="text-5xl font-extrabold text-gray-100 tracking-tight">
          readme.nfo
        </h1>
      </header>

      <ul className="space-y-4">
        {docs.map((doc) => (
          <li key={doc.id}>
            <Card className="bg-gray-900 border border-gray-700 hover:border-indigo-500 transition-colors">
              <Link
                href={`/document/?id=${doc.id}`}
                className="flex items-center justify-between p-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 leading-snug">
                    {doc.title_text}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    <span className="font-medium text-gray-200">Updated:</span>{" "}
                    {new Date(
                      "seconds" in doc.updated_at
                        ? doc.updated_at.seconds * 1000
                        : doc.updated_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight
                  className="h-6 w-6 text-gray-500"
                  aria-hidden="true"
                />
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
