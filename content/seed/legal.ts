import type { LegalPage, RichBlock } from "../../src/lib/content/types.ts";
import { heading, para, RJ } from "./helpers.ts";

/**
 * Estrutura das páginas legais. O conteúdo depende de dados do escritório e de revisão jurídica:
 * tudo o que não foi fornecido está como [PREENCHER]. Os itens técnicos (o que o site faz com os dados)
 * descrevem o funcionamento do site e também precisam de conferência.
 */
const section = (id: string, title: string, text: string): RichBlock[] => [heading(title, `${id}-h`), para(text, `${id}-p`)];

const both = (pt: RichBlock[], en: RichBlock[]) => ({ pt, en });

export const legalSeed: LegalPage[] = [
  {
    id: "privacy",
    title: { pt: "Política de Privacidade", en: "Privacy Policy" },
    body: both(
      [
        ...section("p1", "1. Quem é o responsável pelos dados", `[PREENCHER: nome, documento e endereço do controlador dos dados] ${RJ}`),
        ...section("p2", "2. Quais dados recebemos", `Quando você usa o formulário de contato, recebemos nome, e-mail, telefone, país de residência, área de interesse e a mensagem que você escrever. O site também registra dados técnicos de acesso necessários ao funcionamento e à segurança. Não envie informações sensíveis ou documentos pelo formulário. ${RJ}`),
        ...section("p3", "3. Para que usamos os dados", `Usamos os dados para responder ao seu contato e combinar uma consulta. [PREENCHER: demais finalidades e bases legais] ${RJ}`),
        ...section("p4", "4. Como a mensagem chega até nós", `O formulário apenas envia a sua mensagem por e-mail. O site não guarda as mensagens em banco de dados. O envio é feito por um provedor de e-mail transacional. [PREENCHER: nome do provedor, país e salvaguardas de transferência internacional] ${RJ}`),
        ...section("p5", "5. Cookies e conteúdos de terceiros", `O site só grava cookies de estatística e só carrega vídeos e mapas de terceiros depois do seu consentimento. Veja a página de Cookies. ${RJ}`),
        ...section("p6", "6. Por quanto tempo guardamos os dados", `[PREENCHER: prazo de retenção das mensagens recebidas por e-mail e critério de exclusão] ${RJ}`),
        ...section("p7", "7. Seus direitos", `Você pode pedir informações sobre os seus dados, correção, exclusão e outros direitos previstos na lei de proteção de dados. [PREENCHER: canal e responsável para atender esses pedidos] ${RJ}`),
        ...section("p8", "8. Jurisdição", `[PREENCHER: onde a fundadora pode exercer a advocacia] ${RJ}`),
        ...section("p9", "9. Atualizações desta política", `[PREENCHER: data da última atualização e forma de aviso sobre mudanças] ${RJ}`),
      ],
      [
        ...section("p1", "1. Who is responsible for the data", `[PREENCHER: name, tax ID and address of the data controller] ${RJ}`),
        ...section("p2", "2. What data we receive", `When you use the contact form, we receive your name, email, phone, country of residence, area of interest and the message you write. The site also records technical access data needed for it to work and stay secure. Please do not send sensitive information or documents through the form. ${RJ}`),
        ...section("p3", "3. What we use the data for", `We use the data to reply to your message and arrange a consultation. [PREENCHER: other purposes and legal bases] ${RJ}`),
        ...section("p4", "4. How your message reaches us", `The form only sends your message by email. The site does not store messages in a database. Delivery is handled by a transactional email provider. [PREENCHER: provider name, country and international transfer safeguards] ${RJ}`),
        ...section("p5", "5. Cookies and third-party content", `The site only sets statistics cookies and only loads third-party videos and maps after you consent. See the Cookies page. ${RJ}`),
        ...section("p6", "6. How long we keep the data", `[PREENCHER: retention period for messages received by email and deletion criteria] ${RJ}`),
        ...section("p7", "7. Your rights", `You may ask for information about your data, correction, deletion and other rights set out in data protection law. [PREENCHER: channel and person responsible for handling these requests] ${RJ}`),
        ...section("p8", "8. Jurisdiction", `[PREENCHER: where the founder is authorized to practice law] ${RJ}`),
        ...section("p9", "9. Updates to this policy", `[PREENCHER: date of last update and how changes are announced] ${RJ}`),
      ],
    ),
  },
  {
    id: "terms",
    title: { pt: "Termos de Uso", en: "Terms of Use" },
    body: both(
      [
        ...section("t1", "1. Caráter informativo", `O conteúdo deste site tem caráter informativo e não substitui uma consulta jurídica. Cada situação exige análise individual. ${RJ}`),
        ...section("t2", "2. Sem relação advogado-cliente", `O envio de mensagem pelo site não estabelece relação entre advogado e cliente. Essa relação só existe depois de uma contratação formal. Não envie informações sensíveis pelo formulário. ${RJ}`),
        ...section("t3", "3. Sem promessa de resultado", `Nenhuma informação do site representa promessa de resultado. ${RJ}`),
        ...section("t4", "4. Propriedade intelectual", `[PREENCHER: regras de uso e reprodução dos textos, imagens e marca] ${RJ}`),
        ...section("t5", "5. Links e conteúdos de terceiros", `O site pode ter links e vídeos de terceiros. Não controlamos esses conteúdos. ${RJ}`),
        ...section("t6", "6. Jurisdição", `[PREENCHER: onde a fundadora pode exercer a advocacia] Nos temas internacionais, a atuação cobre os aspectos do direito brasileiro, em coordenação com profissionais locais quando necessário. ${RJ}`),
        ...section("t7", "7. Foro e alterações", `[PREENCHER: foro aplicável e forma de alteração destes termos] ${RJ}`),
      ],
      [
        ...section("t1", "1. Informational nature", `The content of this website is informational and does not replace legal advice. Each situation requires individual analysis. ${RJ}`),
        ...section("t2", "2. No attorney-client relationship", `Sending a message through the website does not create an attorney-client relationship. That relationship only exists after a formal engagement. Please do not send sensitive information through the form. ${RJ}`),
        ...section("t3", "3. No promise of results", `Nothing on this website is a promise of any outcome. ${RJ}`),
        ...section("t4", "4. Intellectual property", `[PREENCHER: rules for using and reproducing texts, images and the brand] ${RJ}`),
        ...section("t5", "5. Third-party links and content", `The website may contain third-party links and videos. We do not control that content. ${RJ}`),
        ...section("t6", "6. Jurisdiction", `[PREENCHER: where the founder is authorized to practice law] On international matters, our work covers the aspects of Brazilian law, in coordination with local professionals when necessary. ${RJ}`),
        ...section("t7", "7. Venue and changes", `[PREENCHER: applicable venue and how these terms may be changed] ${RJ}`),
      ],
    ),
  },
  {
    id: "cookies",
    title: { pt: "Cookies", en: "Cookies" },
    body: both(
      [
        ...section("c1", "1. O que são cookies", `Cookies são pequenos arquivos que um site grava no seu aparelho. ${RJ}`),
        ...section("c2", "2. Como usamos", `Sem o seu consentimento, o site não grava cookies de estatística e não carrega vídeos nem mapas de terceiros. Guardamos apenas a sua escolha sobre cookies. Você pode mudar de ideia a qualquer momento em "Preferências de cookies", no rodapé. ${RJ}`),
        ...section("c3", "3. Categorias", `Necessários: guardam a sua escolha de consentimento. Estatísticas: ajudam a entender como o site é usado, e só funcionam se você permitir. Mídia incorporada: vídeos do YouTube ou do Vimeo e mapas, que só carregam se você permitir. ${RJ}`),
        ...section("c4", "4. Lista de cookies", `[PREENCHER: lista de cookies e prazos, depois de definida a ferramenta de estatísticas] ${RJ}`),
      ],
      [
        ...section("c1", "1. What cookies are", `Cookies are small files that a website stores on your device. ${RJ}`),
        ...section("c2", "2. How we use them", `Without your consent, the site does not set statistics cookies and does not load third-party videos or maps. We only store your choice about cookies. You can change your mind at any time under "Cookie preferences" in the footer. ${RJ}`),
        ...section("c3", "3. Categories", `Necessary: store your consent choice. Statistics: help us understand how the site is used, and only work if you allow them. Embedded media: YouTube or Vimeo videos and maps, which only load if you allow them. ${RJ}`),
        ...section("c4", "4. Cookie list", `[PREENCHER: list of cookies and durations, once the statistics tool is chosen] ${RJ}`),
      ],
    ),
  },
];
