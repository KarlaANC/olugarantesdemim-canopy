import { CanopyEnvironment } from "@customTypes/canopy";
import Container from "@components/Shared/Container";
import FACETS from "@.canopy/facets.json";
import Heading from "../components/Shared/Heading/Heading";
import Hero from "@components/Hero/Hero";
import { HeroWrapper } from "../components/Hero/Hero.styled";
import Layout from "@components/layout";
import { LocaleString } from "@hooks/useLocale";
import React from "react";
import Related from "../components/Related/Related";
import { canopyManifests } from "@lib/constants/canopy";
import { createCollection } from "../lib/iiif/constructors/collection";
import { getRelatedFacetValue } from "../lib/iiif/constructors/related";
import { useCanopyState } from "@context/canopy";
import { Analytics } from '@vercel/analytics/react';

interface IndexProps {
  featuredItem: any;
  collections: string[];
}

const Index: React.FC<IndexProps> = ({ featuredItem, collections }) => {
  const { canopyState } = useCanopyState();
  const {
    config: { baseUrl },
  } = canopyState;

  const hero = {
    ...featuredItem,
    items: featuredItem.items.map((item: any) => {
      return {
        ...item,
        homepage: [
          {
            id: `${baseUrl}/works/`,
            type: "Text",
            label: item.label,
          },
        ],
      };
    }),
  };

  return (
    <Layout>
      <HeroWrapper>
        <Hero collection={hero} />
      </HeroWrapper>
      <Container>
        <Heading as="h2">Sobre a coleção</Heading>
        <div>
          <p>
          O projeto <i>O Lugar Antes de Mim</i> constitui em uma série transmídia que se desenvolve desde 2015, através de filmes médias e longas-metragens, programas de TV, videocasts, podcasts e em breve publicação de livros. 
A série acumula reconhecimento no Brasil e no exterior por sua atuação no registro e difusão do patrimônio cultural, seja ele material ou imaterial, através da seleção para festivais nacionais e internacionais, bem como premiações, 
          como: o Prêmio do Público no festival de cinema francês Rencontres {"d'archéologie"} de la Narbonnaise (2020), com o Prêmio de Melhor longa-metragem no 10º Festcine - Festival de Cinema de Pinhais (2022). 
            Participou do Firenze Archeofilm - Festival Internazionale Del Cinema di Archeologia Arte Ambiente - Itália (2019, 2021 e 2022), do Festival Internacional de Cine Arqueológico del Bidasoa (FICAB), no País Basco/Espanha (2020 e 2023), 
            do Festival de Cinema de Sesimbra Portugal (2018) e do Arraial Cine Fest – Festival de Cinema de Arraial {"D'Ajuda"}/Porto Seguro-BA (2018) e da Mostra Arquivo-Memória Cine Tornado - Brasil (2020).
No canal da proponente (https://www.youtube.com/c/amplercinetv) Ampler Cine TV disponibilizamos os materiais já publicados, bem como no site: www.olugarantesdemim.tv.br e nos perfis @olugarantesdemim (Facebook) e @o.lugar.antes.de.mim (Instagram).
          </p>
        </div>
        <Related
          collections={collections}
          title={LocaleString("homepageHighlightedWorks")}
        />
      </Container>
      <Analytics />
    </Layout>
  );
};

export async function getStaticProps() {
  const manifests = canopyManifests();

  // @ts-ignore
  const { featured, metadata, baseUrl } = process.env
    ?.CANOPY_CONFIG as unknown as CanopyEnvironment;

  const randomFeaturedItem =
    manifests[Math.floor(Math.random() * manifests.length)];
  const featuredItem = await createCollection(
    featured ? featured : [randomFeaturedItem.id]
  );

  const collections = FACETS.map((facet) => {
    const value = getRelatedFacetValue(facet.label);
    return `${baseUrl}/api/facet/${facet.slug}/${value.slug}.json?sort=random`;
  });

  return {
    props: { metadata, featuredItem, collections },
    revalidate: 3600,
  };
}

export default Index;
