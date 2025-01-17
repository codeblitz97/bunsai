import { Loader } from "../types";
import { compile, Options } from "sass";

export default function getSassLoader(options?: Options<"sync">): Loader {
  return (filePath) => {
    return new Response(compile(filePath, options).css, {
      headers: { "Content-Type": "text/css; charset=utf-8" },
    });
  };
}
