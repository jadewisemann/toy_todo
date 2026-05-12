import type { ComponentProps } from "react";

import { Card, CardContent, Separator } from "@/components/ui";

type TodoCardProps = ComponentProps<typeof Card>;
type TodoCardBodyProps = ComponentProps<typeof CardContent>;

export const TodoCard = (
  { children, ...props }: TodoCardProps
) => (
  <Card {...props}>{children}</Card>
);

const TodoCardBody = (
  { className = "space-y-5", ...props }: TodoCardBodyProps
) => (
  <CardContent className={className} {...props} />
);

const TodoCardDivider = () => <Separator />;

TodoCard.Body = TodoCardBody;
TodoCard.Divider = TodoCardDivider;
