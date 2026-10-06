import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonClasses } from "@/components/ui/button-styles";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";

/** Página provisória da etapa 1 (substituída pelas rotas localizadas na etapa 2). */
export default function Page() {
  return (
    <main id="conteudo">
      <Section>
        <Container>
          <Eyebrow>{founderSeed.name}</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">{settingsSeed.siteName.pt}</h1>
          <p className="mt-4 max-w-prose text-lg text-fg-muted">{settingsSeed.footerText.pt}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className={buttonClasses("primary")}>Primário</span>
            <span className={buttonClasses("ghost")}>Contorno</span>
          </div>
        </Container>
      </Section>
      <Section tone="navy">
        <Container>
          <h2 className="text-3xl">Sobre fundo navy</h2>
          <p className="mt-3 text-fg-muted">Texto branco e botão secundário dourado.</p>
          <div className="mt-6">
            <span className={buttonClasses("secondary")}>Secundário</span>
          </div>
        </Container>
      </Section>
    </main>
  );
}
