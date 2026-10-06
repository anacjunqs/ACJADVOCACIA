import { Container, Section } from "./container";

/** Marcador temporário usado enquanto uma rota não foi implementada (será removido nas próximas etapas). */
export function StubPage({ title }: { title: string }) {
  return (
    <Section>
      <Container>
        <h1 className="text-4xl">{title}</h1>
      </Container>
    </Section>
  );
}
