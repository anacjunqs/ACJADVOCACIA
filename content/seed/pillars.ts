import type { PillarContent } from "../../src/lib/content/types.ts";
import { draft } from "./helpers.ts";

/**
 * Introduções, "para quem é", "quando procurar" e FAQ de cada pilar e do hub.
 * Rascunhos em linguagem simples, sem citar artigos de lei, prazos ou valores, e sem promessa de resultado.
 * Todo texto leva [REVISAR JURIDICAMENTE]. Temas internacionais repetem a regra de jurisdição.
 */
const J = {
  pt: "Nossa atuação cobre os aspectos do direito brasileiro, em coordenação com profissionais locais quando necessário.",
  en: "Our work covers the aspects of Brazilian law, in coordination with local professionals when necessary.",
};

export const pillarContentSeed: PillarContent[] = [
  {
    id: "planejamento-patrimonial",
    intro: draft(
      "Planejar o patrimônio é decidir, com calma e antes de qualquer conflito, como os bens da família serão organizados e como serão transmitidos no futuro. Isso vale para bens no Brasil e, quando for o caso, em outros países. O planejamento sucessório é a organização dessa transmissão ainda em vida, por meio de instrumentos como o testamento (documento em que a pessoa define o destino de parte dos seus bens) e a doação (transferência de bens feita em vida).",
      "Planning your estate means deciding, calmly and before any conflict, how the family's assets will be organized and passed on in the future. This applies to assets in Brazil and, where relevant, in other countries. Succession planning is the organization of that transfer during one's lifetime, through tools such as a will (a document in which a person decides what happens to part of their assets) and a gift (a transfer of assets made while alive).",
    ),
    whoFor: draft(
      "Casais que querem organizar o patrimônio antes ou durante o casamento; famílias com filhos de relacionamentos anteriores; pessoas com bens no Brasil e no exterior; famílias que têm empresa.",
      "Couples who want to organize their assets before or during marriage; families with children from previous relationships; people with assets in Brazil and abroad; families that own a business.",
    ),
    whenToSeek: draft(
      "Quando você quer evitar dúvidas e conflitos no futuro; ao comprar um imóvel; ao casar ou formar uma nova família; ao mudar de país.",
      "When you want to avoid doubts and conflicts in the future; when buying property; when marrying or forming a new family; when moving to another country.",
    ),
    internationalIntro: draft(
      `Para famílias com bens ou vínculos em mais de um país, o planejamento exige atenção a regras de lugares diferentes. ${J.pt}`,
      `For families with assets or ties in more than one country, planning calls for attention to the rules of different places. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "O que é planejamento sucessório?", en: "What is succession planning?" },
        answer: draft(
          "É a organização, em vida, da forma como os bens da família serão transmitidos depois. Serve para reduzir dúvidas, conflitos e demora entre os herdeiros (as pessoas que têm direito à herança). Cada família tem uma situação própria, por isso o caminho é definido caso a caso.",
          "It is the organization, during one's lifetime, of how the family's assets will be passed on afterwards. It helps reduce doubts, conflicts and delays among the heirs (the people entitled to the inheritance). Every family is different, so the path is defined case by case.",
        ),
      },
      {
        question: { pt: "Preciso fazer um testamento?", en: "Do I need to make a will?" },
        answer: draft(
          "Nem sempre. Depende da composição da família, dos bens e do que você deseja. Em uma consulta, explicamos as opções existentes, e a decisão é sua.",
          "Not always. It depends on your family, your assets and what you want. In a consultation, we explain the available options, and the decision is yours.",
        ),
      },
      {
        question: { pt: "O que é uma holding familiar?", en: "What is a family holding company?" },
        answer: draft(
          "É uma empresa criada para reunir e administrar bens da família, como imóveis e participações em outras empresas. Ela pode ajudar na organização, mas não serve para todos os casos. A análise é individual.",
          "It is a company created to hold and manage family assets, such as real estate and shares in other companies. It can help with organization, but it does not suit every case. The analysis is individual.",
        ),
      },
      {
        question: { pt: "Tenho bens no Brasil e em outro país. Como o planejamento funciona?", en: "I have assets in Brazil and in another country. How does planning work?" },
        answer: draft(
          `Cada país tem as suas próprias regras. ${J.pt}`,
          `Each country has its own rules. ${J.en}`,
        ),
      },
      {
        question: { pt: "Posso doar bens aos meus filhos ainda em vida?", en: "Can I give assets to my children while I am alive?" },
        answer: draft(
          "Em geral, é possível, mas existem regras que protegem os herdeiros. Por isso, é importante analisar cada caso antes de assinar qualquer documento.",
          "In general, it is possible, but there are rules that protect the heirs. That is why it is important to review each case before signing any document.",
        ),
      },
    ],
  },
  {
    id: "casamento-uniao",
    intro: draft(
      "Casamento e união estável (a relação de convivência pública, contínua e duradoura, com o objetivo de formar família) têm efeitos sobre os bens e sobre os direitos de cada pessoa. Por isso, é importante conhecer as opções antes de decidir. O regime de bens é o conjunto de regras que define o que é de cada um e o que é do casal. O pacto antenupcial é o contrato feito antes do casamento para escolher esse regime. Quando o casamento acontece no exterior ou envolve uma pessoa estrangeira, também é preciso cuidar do registro dos documentos no Brasil.",
      "Marriage and stable union (a public, continuous and lasting cohabitation with the aim of forming a family) have effects on property and on each person's rights. That is why it is important to know the options before deciding. The property regime is the set of rules that defines what belongs to each person and what belongs to the couple. A prenuptial agreement is the contract made before the wedding to choose that regime. When the marriage takes place abroad or involves a foreign national, the documents also need to be registered in Brazil.",
    ),
    whoFor: draft(
      "Casais que vão se casar ou que já vivem juntos; casais em que uma das pessoas é estrangeira; brasileiros que se casaram fora do país; quem precisa regularizar documentos de estado civil.",
      "Couples who are about to marry or already live together; couples in which one person is a foreign national; Brazilians who married abroad; anyone who needs to regularize marital-status documents.",
    ),
    whenToSeek: draft(
      "Antes do casamento ou da união estável; ao querer mudar o regime de bens; depois de casar no exterior; ao precisar registrar ou corrigir documentos.",
      "Before the marriage or stable union; when you want to change the property regime; after marrying abroad; when you need to register or correct documents.",
    ),
    internationalIntro: draft(
      `Casamentos celebrados em outro país ou entre pessoas de nacionalidades diferentes pedem cuidado com documentos e com o registro no Brasil. ${J.pt}`,
      `Marriages celebrated in another country or between people of different nationalities call for care with documents and with registration in Brazil. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "O que é regime de bens?", en: "What is a property regime?" },
        answer: draft(
          "É o conjunto de regras que define como ficam os bens do casal durante o casamento e em caso de divórcio ou falecimento. Existem diferentes regimes, e cada um tem efeitos próprios.",
          "It is the set of rules that defines what happens to the couple's assets during the marriage and in case of divorce or death. There are different regimes, and each has its own effects.",
        ),
      },
      {
        question: { pt: "O que é um pacto antenupcial e quando ele é usado?", en: "What is a prenuptial agreement and when is it used?" },
        answer: draft(
          "É um contrato, feito em cartório antes do casamento, em que o casal escolhe regras próprias para os seus bens. É usado quando o casal quer algo diferente do que a lei prevê por padrão.",
          "It is a contract, made before a notary before the wedding, in which the couple chooses its own rules for their assets. It is used when the couple wants something different from what the law provides by default.",
        ),
      },
      {
        question: { pt: "Qual é a diferença entre casamento e união estável?", en: "What is the difference between marriage and stable union?" },
        answer: draft(
          "Os dois formam uma família e têm efeitos jurídicos, mas a forma de começar, de provar e de registrar é diferente. Entender essas diferenças ajuda o casal a escolher o que faz mais sentido para a sua realidade.",
          "Both form a family and have legal effects, but the way they begin, are proven and are registered is different. Understanding these differences helps the couple choose what makes the most sense for their situation.",
        ),
      },
      {
        question: { pt: "Casei no exterior. Meu casamento vale no Brasil?", en: "I married abroad. Is my marriage valid in Brazil?" },
        answer: draft(
          `Depende da situação e dos documentos. Em geral, o casamento feito fora do país precisa ser registrado no Brasil para produzir todos os seus efeitos aqui. ${J.pt}`,
          `It depends on the situation and the documents. In general, a marriage celebrated abroad needs to be registered in Brazil to have all its effects here. ${J.en}`,
        ),
      },
      {
        question: { pt: "Posso mudar o regime de bens depois de casado?", en: "Can I change the property regime after marriage?" },
        answer: draft(
          "Em alguns casos, sim, mas existem requisitos e o procedimento depende da situação do casal. Por isso, a análise é feita caso a caso.",
          "In some cases, yes, but there are requirements and the procedure depends on the couple's situation. That is why the analysis is done case by case.",
        ),
      },
      {
        question: { pt: "Preciso traduzir documentos estrangeiros?", en: "Do I need to translate foreign documents?" },
        answer: draft(
          "Em regra, documentos em outro idioma precisam de tradução juramentada (feita por tradutor oficial) e, às vezes, de apostilamento (certificação que dá validade internacional ao documento). Verificamos o que cada caso exige.",
          "As a rule, documents in another language need a sworn translation (made by an official translator) and sometimes an apostille (a certification that gives the document international validity). We check what each case requires.",
        ),
      },
    ],
  },
  {
    id: "divorcio-partilha",
    intro: draft(
      "O divórcio encerra o casamento. A partilha é a divisão dos bens do casal. Os dois assuntos podem ser resolvidos juntos ou separadamente, por acordo ou, quando não há acordo, pela Justiça. Quando há bens ou pessoas em outro país, ou quando o divórcio foi feito no exterior, é preciso analisar como isso vale no Brasil.",
      "Divorce ends the marriage. Property division is the splitting of the couple's assets. The two matters can be resolved together or separately, by agreement or, when there is no agreement, by the courts. When there are assets or people in another country, or when the divorce took place abroad, it is necessary to analyze how this applies in Brazil.",
    ),
    whoFor: draft(
      "Pessoas que estão se separando ou que já se separaram; casais que querem resolver tudo por acordo; quem se divorciou no exterior; quem tem bens em mais de um país.",
      "People who are separating or have already separated; couples who want to settle everything by agreement; people who divorced abroad; people with assets in more than one country.",
    ),
    whenToSeek: draft(
      "Quando a decisão de se separar já foi tomada ou está sendo considerada; antes de assinar qualquer acordo; ao precisar dividir bens; ao precisar reconhecer no Brasil um divórcio feito fora.",
      "When the decision to separate has been made or is being considered; before signing any agreement; when you need to divide assets; when you need to have a divorce granted abroad recognized in Brazil.",
    ),
    internationalIntro: draft(
      `Divórcios com bens ou pessoas em outro país, ou feitos no exterior, envolvem regras de mais de um lugar. ${J.pt}`,
      `Divorces involving assets or people in another country, or granted abroad, involve the rules of more than one place. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "Quais são os caminhos para se divorciar?", en: "What are the ways to get a divorce?" },
        answer: draft(
          "O divórcio pode ser feito por acordo ou por decisão da Justiça. Em alguns casos, também pode ser feito em cartório. O caminho mais adequado depende da situação de cada casal.",
          "A divorce can be reached by agreement or by a court decision. In some cases, it can also be done before a notary. The most suitable path depends on each couple's situation.",
        ),
      },
      {
        question: { pt: "O que acontece com os bens no divórcio?", en: "What happens to the assets in a divorce?" },
        answer: draft(
          "Depende do regime de bens escolhido pelo casal e da história de cada patrimônio. Os bens são analisados para definir o que é de cada pessoa e o que é do casal.",
          "It depends on the property regime chosen by the couple and on the history of each asset. The assets are analyzed to define what belongs to each person and what belongs to the couple.",
        ),
      },
      {
        question: { pt: "A divisão dos bens precisa ser feita junto com o divórcio?", en: "Does the division of assets have to happen together with the divorce?" },
        answer: draft(
          "Não necessariamente. A partilha (a divisão dos bens) pode ser feita junto com o divórcio ou depois dele. Cada opção tem consequências, por isso vale analisar antes de decidir.",
          "Not necessarily. The property division can be done together with the divorce or afterwards. Each option has consequences, so it is worth analyzing before deciding.",
        ),
      },
      {
        question: { pt: "Temos bens em outro país. Como fica?", en: "We have assets in another country. What happens?" },
        answer: draft(
          `Cada país tem as suas próprias regras. ${J.pt}`,
          `Each country has its own rules. ${J.en}`,
        ),
      },
      {
        question: { pt: "Me divorciei fora do Brasil. Preciso fazer algo aqui?", en: "I divorced outside Brazil. Do I need to do anything here?" },
        answer: draft(
          "Em muitos casos, o divórcio feito no exterior precisa ser reconhecido no Brasil para produzir efeitos aqui, por exemplo, para registrar um novo casamento. Analisamos o que cada situação exige.",
          "In many cases, a divorce granted abroad needs to be recognized in Brazil to have effects here, for example to register a new marriage. We analyze what each situation requires.",
        ),
      },
      {
        question: { pt: "É possível resolver tudo por acordo?", en: "Is it possible to settle everything by agreement?" },
        answer: draft(
          "Isso depende do diálogo entre as pessoas e do que está em discussão. Podemos orientar sobre as opções, inclusive a mediação (uma conversa conduzida por um terceiro neutro para ajudar as partes a chegarem a um acordo).",
          "That depends on the dialogue between the people and on what is being discussed. We can advise on the options, including mediation (a conversation led by a neutral third party to help the parties reach an agreement).",
        ),
      },
    ],
  },
  {
    id: "filhos-guarda",
    intro: draft(
      "Guarda é a responsabilidade pelos cuidados e pelas decisões da vida dos filhos. Convivência é o tempo que cada pai ou mãe passa com eles. Esses temas são sensíveis, e o foco é sempre o bem-estar da criança ou do adolescente. Quando a família vive entre países, surgem questões a mais: mudança de país, viagens, passaporte e, em casos graves, a retirada ou a retenção de uma criança em outro país, tema tratado por um acordo internacional chamado Convenção da Haia de 1980.",
      "Custody is the responsibility for the care of, and decisions about, the children's lives. Parenting time is the time each parent spends with them. These are sensitive topics, and the focus is always the well-being of the child or teenager. When the family lives between countries, extra questions arise: moving abroad, travel, passports and, in serious cases, a child being taken or kept in another country, a subject covered by an international agreement called the 1980 Hague Convention.",
    ),
    whoFor: draft(
      "Pais e mães que estão se separando; famílias que querem organizar a convivência; quem planeja mudar de cidade ou de país com os filhos; famílias em que uma criança foi levada ou retida em outro país.",
      "Parents who are separating; families who want to organize parenting time; people planning to move to another city or country with their children; families in which a child was taken or kept in another country.",
    ),
    whenToSeek: draft(
      "Ao se separar; quando o acordo atual não funciona mais; antes de uma mudança de cidade ou de país; antes de viagens internacionais com menores; o quanto antes, se uma criança estiver retida em outro país.",
      "When separating; when the current arrangement no longer works; before moving to another city or country; before international travel with minors; as soon as possible if a child is being kept in another country.",
    ),
    internationalIntro: draft(
      `Mudanças de país, viagens e disputas entre países envolvem regras de mais de um lugar. ${J.pt}`,
      `Moves abroad, travel and cross-border disputes involve the rules of more than one place. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "Qual é a diferença entre guarda compartilhada e guarda unilateral?", en: "What is the difference between joint custody and sole custody?" },
        answer: draft(
          "Na guarda compartilhada, pai e mãe dividem as responsabilidades e as decisões sobre a vida dos filhos. Na guarda unilateral, uma só pessoa fica com essa responsabilidade, e a outra acompanha e convive. Cada caso é analisado de acordo com a situação da família.",
          "In joint custody, both parents share responsibility and decisions about the children's lives. In sole custody, one person holds that responsibility, and the other follows along and spends time with the children. Each case is analyzed according to the family's situation.",
        ),
      },
      {
        question: { pt: "A guarda e a convivência podem ser mudadas depois?", en: "Can custody and parenting time be changed later?" },
        answer: draft(
          "Sim, quando a situação da família muda e isso afeta a criança. É preciso avaliar cada caso.",
          "Yes, when the family's situation changes and this affects the child. Each case needs to be assessed.",
        ),
      },
      {
        question: { pt: "Posso me mudar de cidade ou de país com meus filhos?", en: "Can I move to another city or country with my children?" },
        answer: draft(
          "Depende. Em geral, mudanças que afetam a convivência com o outro responsável precisam ser conversadas e, às vezes, autorizadas pela Justiça. Por isso, é importante buscar orientação antes de se mudar.",
          "It depends. In general, moves that affect the other parent's time with the children need to be discussed and, sometimes, authorized by the courts. That is why it is important to seek guidance before moving.",
        ),
      },
      {
        question: { pt: "Preciso de autorização para viajar com meu filho ao exterior?", en: "Do I need authorization to travel abroad with my child?" },
        answer: draft(
          "Em muitas situações, sim. Pode ser necessária a autorização do outro responsável. As exigências variam conforme o caso, por isso vale verificar antes da viagem.",
          "In many situations, yes. The other parent's authorization may be required. Requirements vary by case, so it is worth checking before the trip.",
        ),
      },
      {
        question: { pt: "O que é a Convenção da Haia de 1980?", en: "What is the 1980 Hague Convention?" },
        answer: draft(
          `É um tratado internacional, do qual o Brasil faz parte, que trata do retorno de crianças levadas ou mantidas de forma ilegal em outro país. ${J.pt}`,
          `It is an international treaty, to which Brazil is a party, that deals with the return of children wrongfully taken to or kept in another country. ${J.en}`,
        ),
      },
      {
        question: { pt: "Os pais moram em países diferentes. Como fica a convivência?", en: "The parents live in different countries. How does parenting time work?" },
        answer: draft(
          `Cada situação envolve regras de mais de um país. ${J.pt}`,
          `Each situation involves the rules of more than one country. ${J.en}`,
        ),
      },
    ],
  },
  {
    id: "alimentos",
    intro: draft(
      "Na linguagem jurídica, \"alimentos\" são os recursos destinados a cobrir necessidades básicas, como moradia, saúde, educação e alimentação. É o que as pessoas costumam chamar de pensão alimentícia. Ela pode ser devida a filhos e, em alguns casos, a ex-cônjuges ou ex-companheiros. Também é possível pedir a revisão quando a situação muda, ou a cobrança quando há atraso. Se quem paga ou quem recebe mora em outro país, existem caminhos específicos entre países.",
      "In legal language, \"alimentos\" (support) are the resources meant to cover basic needs such as housing, health, education and food. It is what people usually call child support or alimony. It may be owed to children and, in some cases, to former spouses or partners. It is also possible to ask for a review when circumstances change, or for enforcement when payments are late. If the paying or the receiving party lives in another country, there are specific paths between countries.",
    ),
    whoFor: draft(
      "Pais e mães que precisam pedir ou organizar a pensão dos filhos; pessoas que precisam revisar a pensão; quem enfrenta atraso no pagamento; famílias em que quem paga ou quem recebe vive em outro país.",
      "Parents who need to request or organize support for their children; people who need to review support; those facing late payments; families in which the paying or the receiving party lives in another country.",
    ),
    whenToSeek: draft(
      "Na separação; quando a situação financeira ou as necessidades mudam; quando há atraso no pagamento; quando uma das partes muda de país.",
      "At separation; when financial circumstances or needs change; when payments are late; when one of the parties moves to another country.",
    ),
    internationalIntro: draft(
      `Pedir ou cobrar pensão quando as pessoas vivem em países diferentes envolve regras de mais de um lugar. ${J.pt}`,
      `Requesting or collecting support when the people live in different countries involves the rules of more than one place. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "O que são alimentos?", en: "What is \"alimentos\" (support)?" },
        answer: draft(
          "São os recursos destinados a cobrir necessidades básicas, como moradia, saúde, educação e alimentação. No dia a dia, é conhecido como pensão alimentícia.",
          "These are the resources meant to cover basic needs such as housing, health, education and food. In everyday language, it is known as child support or alimony.",
        ),
      },
      {
        question: { pt: "Como a pensão é definida?", en: "How is support determined?" },
        answer: draft(
          "Em regra, a análise considera as necessidades de quem recebe e as possibilidades de quem paga. Cada caso é avaliado individualmente.",
          "As a rule, the analysis considers the needs of the person receiving support and the means of the person paying. Each case is assessed individually.",
        ),
      },
      {
        question: { pt: "A pensão pode ser revista?", en: "Can support be reviewed?" },
        answer: draft(
          "Sim, quando há mudança importante na situação de quem paga ou de quem recebe. É preciso analisar cada caso.",
          "Yes, when there is an important change in the situation of the person paying or the person receiving. Each case needs to be analyzed.",
        ),
      },
      {
        question: { pt: "O que fazer se a pensão não é paga?", en: "What can be done if support is not paid?" },
        answer: draft(
          "Existem formas de cobrar os pagamentos em atraso. O caminho depende da situação. Vale buscar orientação logo no início do atraso.",
          "There are ways to collect late payments. The path depends on the situation. It is worth seeking guidance as soon as payments start to run late.",
        ),
      },
      {
        question: { pt: "Quem paga ou quem recebe mora no exterior. Como fica?", en: "The paying or receiving party lives abroad. What happens?" },
        answer: draft(
          `Existem formas de pedir ou cobrar pensão entre países. ${J.pt}`,
          `There are ways to request or collect support between countries. ${J.en}`,
        ),
      },
      {
        question: { pt: "Um filho maior de idade ainda pode receber pensão?", en: "Can an adult child still receive support?" },
        answer: draft(
          "Em algumas situações, sim, por exemplo, quando ainda está estudando ou não consegue se sustentar. Isso é analisado caso a caso.",
          "In some situations, yes, for example when the child is still studying or cannot support themselves. This is analyzed case by case.",
        ),
      },
    ],
  },
  {
    id: "filiacao",
    intro: draft(
      "Filiação é o vínculo jurídico entre pais e filhos. Esse vínculo pode ter origem biológica ou afetiva, e pode ser reconhecido ou contestado. O reconhecimento de filiação é o ato que registra oficialmente quem são os pais de uma pessoa. Quando o nascimento aconteceu no exterior, ou os pais vivem em países diferentes, é preciso cuidar do registro e do reconhecimento no Brasil.",
      "Parentage is the legal bond between parents and children. This bond may be biological or based on affection, and it can be recognized or contested. Establishing parentage is the act that officially records who a person's parents are. When the birth took place abroad, or the parents live in different countries, registration and recognition in Brazil need attention.",
    ),
    whoFor: draft(
      "Pessoas que querem reconhecer ou registrar um filho; filhos que querem registrar quem são seus pais; quem precisa corrigir um registro de nascimento; famílias com nascimento no exterior.",
      "People who want to acknowledge or register a child; children who want to register who their parents are; anyone who needs to correct a birth record; families with a birth abroad.",
    ),
    whenToSeek: draft(
      "Quando o registro de nascimento não reflete a realidade da família; quando há dúvida sobre a paternidade ou a maternidade; quando um filho nasceu no exterior e precisa ser registrado no Brasil.",
      "When the birth record does not reflect the family's reality; when there is doubt about paternity or maternity; when a child was born abroad and needs to be registered in Brazil.",
    ),
    internationalIntro: draft(
      `Nascimentos no exterior e famílias com pessoas de países diferentes pedem atenção ao registro e ao reconhecimento no Brasil. ${J.pt}`,
      `Births abroad and families with people from different countries call for attention to registration and recognition in Brazil. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "O que é reconhecimento de filiação?", en: "What does establishing parentage mean?" },
        answer: draft(
          "É o ato que registra oficialmente quem são os pais de uma pessoa. Pode ser feito de forma voluntária ou, quando necessário, por decisão da Justiça.",
          "It is the act that officially records who a person's parents are. It can be done voluntarily or, when necessary, by a court decision.",
        ),
      },
      {
        question: { pt: "O que é filiação socioafetiva?", en: "What is socio-affective parentage?" },
        answer: draft(
          "É o vínculo de pai ou mãe construído pelo convívio e pelo afeto, mesmo sem laço biológico. Em certas situações, esse vínculo pode ser reconhecido oficialmente. A possibilidade e o caminho dependem de cada caso.",
          "It is the bond of a father or mother built through everyday life and affection, even without a biological tie. In certain situations, this bond can be officially recognized. The possibility and the path depend on each case.",
        ),
      },
      {
        question: { pt: "É possível ter mais de um pai ou mais de uma mãe no registro?", en: "Is it possible to have more than one father or mother on the record?" },
        answer: draft(
          "Em algumas situações, a Justiça reconhece a multiparentalidade, que é a existência de mais de um pai ou mãe no registro. Cada caso precisa ser analisado.",
          "In some situations, the courts recognize multiple parentage, which means having more than one father or mother on the record. Each case needs to be analyzed.",
        ),
      },
      {
        question: { pt: "Dá para contestar uma paternidade já registrada?", en: "Can a registered paternity be contested?" },
        answer: draft(
          "Em alguns casos, sim, mas há regras e limites. A análise depende da história e das provas de cada situação.",
          "In some cases, yes, but there are rules and limits. The analysis depends on the history and the evidence of each situation.",
        ),
      },
      {
        question: { pt: "Meu filho nasceu no exterior. Como registrar no Brasil?", en: "My child was born abroad. How do I register the birth in Brazil?" },
        answer: draft(
          `O nascimento ocorrido fora do país costuma ser registrado no Brasil por meio de procedimentos específicos. Verificamos os documentos necessários. ${J.pt}`,
          `A birth that took place abroad is usually registered in Brazil through specific procedures. We check the documents required. ${J.en}`,
        ),
      },
    ],
  },
  {
    id: "inventario-sucessoes",
    intro: draft(
      "Inventário é o procedimento que identifica, organiza e divide os bens deixados por uma pessoa que faleceu. Pode ser feito pela Justiça (inventário judicial) ou em cartório (inventário extrajudicial), conforme a situação da família. Herdeiros são as pessoas que têm direito à herança. Quando há herdeiros ou bens em outro país, ou quando a pessoa faleceu no exterior, o processo exige atenção a regras de mais de um lugar.",
      "Probate (inventário) is the procedure that identifies, organizes and divides the assets left by a person who has died. It can be handled by the courts (court probate) or before a notary (out-of-court probate), depending on the family's situation. Heirs are the people entitled to the inheritance. When there are heirs or assets in another country, or when the person died abroad, the process calls for attention to the rules of more than one place.",
    ),
    whoFor: draft(
      "Famílias que perderam alguém e precisam organizar a herança; herdeiros que moram fora do Brasil; quem recebeu herança no exterior; quem tem dúvidas ou conflitos com outros herdeiros.",
      "Families who have lost someone and need to organize the inheritance; heirs who live outside Brazil; people who received an inheritance abroad; people with questions or conflicts with other heirs.",
    ),
    whenToSeek: draft(
      "Depois de um falecimento, quando for o momento de organizar os bens; ao precisar vender ou regularizar imóveis da herança; quando há desacordo entre herdeiros; quando há bens ou herdeiros em outro país.",
      "After a death, when it is time to organize the assets; when you need to sell or regularize inherited property; when heirs disagree; when there are assets or heirs in another country.",
    ),
    internationalIntro: draft(
      `Heranças com pessoas ou bens em mais de um país envolvem regras de lugares diferentes. ${J.pt}`,
      `Inheritances involving people or assets in more than one country involve the rules of different places. ${J.en}`,
    ),
    faq: [
      {
        question: { pt: "O que é inventário?", en: "What is probate (inventário)?" },
        answer: draft(
          "É o procedimento que identifica os bens e as dívidas deixados por quem faleceu e os divide entre os herdeiros. Sem ele, em geral, os bens não podem ser transferidos formalmente.",
          "It is the procedure that identifies the assets and debts left by the person who died and divides them among the heirs. Without it, in general, the assets cannot be formally transferred.",
        ),
      },
      {
        question: { pt: "Inventário judicial ou extrajudicial: qual escolher?", en: "Court or out-of-court probate: which to choose?" },
        answer: draft(
          "A escolha depende de fatores como a existência de testamento, a concordância entre os herdeiros e a situação de cada um. Explicamos as opções para você decidir.",
          "The choice depends on factors such as whether there is a will, whether the heirs agree and each person's situation. We explain the options so you can decide.",
        ),
      },
      {
        question: { pt: "Quem tem direito à herança?", en: "Who is entitled to an inheritance?" },
        answer: draft(
          "A lei define quem são os herdeiros, e isso depende da situação familiar da pessoa que faleceu. Por isso, é preciso analisar cada caso.",
          "The law defines who the heirs are, and this depends on the family situation of the person who died. That is why each case needs to be analyzed.",
        ),
      },
      {
        question: { pt: "O que acontece se os herdeiros não concordam?", en: "What happens if the heirs do not agree?" },
        answer: draft(
          "Quando não há acordo, o assunto pode ser levado à Justiça. Também é possível tentar a mediação, uma conversa conduzida por um terceiro neutro para buscar um acordo.",
          "When there is no agreement, the matter can be taken to court. It is also possible to try mediation, a conversation led by a neutral third party to seek an agreement.",
        ),
      },
      {
        question: { pt: "Há bens ou herdeiros no exterior. Como fica?", en: "There are assets or heirs abroad. What happens?" },
        answer: draft(
          `Cada país tem as suas próprias regras. ${J.pt}`,
          `Each country has its own rules. ${J.en}`,
        ),
      },
    ],
  },
  {
    id: "hub",
    intro: draft(
      `Famílias entre países enfrentam, ao mesmo tempo, as regras de lugares diferentes. Um casamento pode ter sido celebrado fora do Brasil, os filhos podem viver em outro país, os bens podem estar espalhados e a família pode precisar de documentos aceitos dos dois lados. Esta página reúne, em um só lugar, os temas de Família e Sucessões que costumam aparecer nessas situações. ${J.pt}`,
      `Families between countries face the rules of different places at the same time. A marriage may have been celebrated outside Brazil, the children may live in another country, assets may be spread out, and the family may need documents accepted on both sides. This page brings together, in one place, the Family and Succession topics that usually come up in these situations. ${J.en}`,
    ),
    whoFor: draft(
      "Brasileiros que vivem no exterior; estrangeiros com vínculos no Brasil, como família, bens ou herança; casais e famílias binacionais.",
      "Brazilians living abroad; foreign nationals with ties to Brazil, such as family, property or inheritance; binational couples and families.",
    ),
    whenToSeek: draft(
      "Ao se casar, se separar ou ter filhos em outro país; ao comprar ou vender bens no Brasil; ao organizar uma herança com pessoas ou bens em mais de um país; ao precisar de documentos válidos no Brasil.",
      "When marrying, separating or having children in another country; when buying or selling assets in Brazil; when organizing an inheritance involving people or assets in more than one country; when you need documents valid in Brazil.",
    ),
    internationalIntro: draft(J.pt, J.en),
    faq: [
      {
        question: { pt: "Vocês atendem quem mora fora do Brasil?", en: "Do you work with people who live outside Brazil?" },
        answer: draft(
          "Sim, orientamos pessoas que moram no exterior sobre questões do direito brasileiro. O atendimento pode ser feito a distância. [PREENCHER: confirmar formatos de atendimento]",
          "Yes, we advise people who live abroad on matters of Brazilian law. Appointments can be held remotely. [PREENCHER: confirm appointment formats]",
        ),
      },
      {
        question: { pt: "O escritório também cuida das questões no outro país?", en: "Does the firm also handle matters in the other country?" },
        answer: draft(
          "Nossa atuação cobre os aspectos do direito brasileiro. Quando a situação exige conhecimento do direito de outro país, trabalhamos em coordenação com profissionais locais, que atuam nesse país.",
          "Our work covers the aspects of Brazilian law. When the situation requires knowledge of another country's law, we work in coordination with local professionals who practice in that country.",
        ),
      },
      {
        question: { pt: "Preciso de uma procuração para resolver algo no Brasil?", en: "Do I need a power of attorney to handle something in Brazil?" },
        answer: draft(
          "Em muitas situações, quem vive fora pode ser representado no Brasil por meio de uma procuração (documento em que a pessoa autoriza outra a agir em seu nome). O formato depende do caso e do país onde o documento é assinado.",
          "In many situations, someone living abroad can be represented in Brazil through a power of attorney (a document in which a person authorizes another to act on their behalf). The format depends on the case and on the country where the document is signed.",
        ),
      },
      {
        question: { pt: "Documentos de outro país valem no Brasil?", en: "Are documents from another country valid in Brazil?" },
        answer: draft(
          "Em geral, precisam de tradução juramentada (feita por tradutor oficial) e, em muitos casos, de apostilamento ou legalização (certificações que dão validade internacional ao documento). Verificamos o que cada documento exige.",
          "In general, they need a sworn translation (made by an official translator) and, in many cases, an apostille or legalization (certifications that give a document international validity). We check what each document requires.",
        ),
      },
      {
        question: { pt: "Uma decisão de um juiz de outro país vale no Brasil?", en: "Is a ruling from a judge in another country valid in Brazil?" },
        answer: draft(
          "Muitas vezes, decisões estrangeiras precisam ser reconhecidas pela Justiça brasileira para produzir efeitos aqui. O caminho depende do tipo de decisão.",
          "Often, foreign rulings need to be recognized by the Brazilian courts to have effects here. The path depends on the type of ruling.",
        ),
      },
    ],
  },
];

export const pillarContentById = Object.fromEntries(pillarContentSeed.map((p) => [p.id, p])) as Record<PillarContent["id"], PillarContent>;
