import React, { useEffect, useRef } from "react";
export default function Motion({
  children,
  className = "",
  as: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const nodes = element.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    nodes.forEach((node) => {
      node.classList.add("reveal-ready");
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
