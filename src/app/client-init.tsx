"use client";
import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("cleaner");
  }, []);

  return null; 
}