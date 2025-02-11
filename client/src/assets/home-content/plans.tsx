export const plans = [
  {
    title: "Free",
    price: (
      <>
        $0<span className="text-sm font-normal">/month</span>
      </>
    ),
    inclusions: ["Up to 3 quizzes", "Basic analytics", "Community support"],
    button: {
      text: "Get Started",
      link: "#",
    },
  },
  {
    title: "Pro",
    justRight: true,
    price: (
      <>
        $10<span className="text-sm font-normal">/month</span>
      </>
    ),
    inclusions: [
      "Unlimited quizzes",
      "Advanced analytics",
      "GitHub integration",
      "Priority support",
    ],
    button: {
      text: "Get Pro",
      link: "#",
    },
  },
  {
    title: "Enterprise",
    price: "Custom",
    inclusions: ["Custom integrations", "Dedicated support", "Custom features"],
    button: {
      text: "Contact Us",
      link: "#",
    },
  },
];
