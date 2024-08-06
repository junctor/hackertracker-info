import Link from "next/link";
import Heading from "../heading/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Markdown from "../markdown/Markdown";

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
            <Markdown content={doc.body_text} />
          </div>
        </div>
      </div>
    </div>
  );
}
