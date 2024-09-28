import { notFound } from "next/navigation";

type Props = {
  params: {
    gender: string;
    category: string[];
  };
};

export default function CategoryGenderPage(props: Props) {
  if (props.params.category?.length > 1) notFound();

  return <h1>CategoryGenderPage - {props.params.gender}</h1>;
}
