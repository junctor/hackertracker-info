import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Heading from "../heading/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function DocumentDetails({ doc }: { doc: HTDocument }) {
  return (
    <div>
      <Heading />
      <div className="mx-5">
        <div className="my-2 justify-start flex-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/docs">Documents</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
              {doc.title_text}
            </h1>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm md:text-base lg:text-lg w-11/12">
            <div className="prose lg:prose-xl whitespace-pre-wrap">
              <ReactMarkdown>{doc.body_text}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
