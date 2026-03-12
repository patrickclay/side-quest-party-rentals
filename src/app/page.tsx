import { Button } from "./components/ui/Button";
import { SectionLabel } from "./components/ui/SectionLabel";
import { SectionTitle } from "./components/ui/SectionTitle";
import { TargetIcon } from "./components/ui/Icons";

export default function Home() {
  return (
    <main className="p-12">
      <SectionLabel>// TEST LABEL</SectionLabel>
      <SectionTitle>Test Title</SectionTitle>
      <Button variant="primary">
        <TargetIcon className="w-5 h-5" />
        Primary Button
      </Button>
    </main>
  );
}
