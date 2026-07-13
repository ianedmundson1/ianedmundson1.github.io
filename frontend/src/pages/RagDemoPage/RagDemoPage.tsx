import PlotlyEmbed from '@/components/PlotlyEmbed';
import ProjectDetailLayout from '@/components/ProjectDetailLayout';
import styles from './RagDemoPage.module.css';

const META = {
  title: 'RAG Demo',
  summary:
    'An end-to-end Retrieval-Augmented Generation pipeline on the SQuAD dataset. Chunks and embeds Wikipedia passages, retrieves top-k context with FAISS, generates grounded answers with GPT-4o via LangChain LCEL, and scores the system with RAGAS.',
  badges: [
    { label: 'LLM • Retrieval' },
    { label: 'Notebook' },
  ],
} as const;

const HIGHLIGHTS = [
  { value: '0.95', label: 'Faithfulness' },
  { value: '0.97', label: 'Answer Relevancy' },
  { value: '1.00', label: 'Context Recall' },
  { value: '0.94', label: 'Answer Correctness' },
] as const;

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Load',
    description:
      'Pull SQuAD via Hugging Face datasets and deduplicate by context hash. 100 QA pairs collapse to 21 unique Wikipedia passages about Notre Dame.',
  },
  {
    step: 2,
    title: 'Chunk',
    description:
      'Split with RecursiveCharacterTextSplitter at 250 tokens, no overlap, using the embedding model\'s tokenizer rather than raw character counts.',
  },
  {
    step: 3,
    title: 'Embed & Index',
    description:
      'Encode each chunk with Azure text-embedding-ada-002 (1536-dim) into a FAISS L2 index. UMAP projects to 3D for visual inspection.',
  },
  {
    step: 4,
    title: 'Retrieve',
    description:
      'Wrap FAISS as a LangChain retriever (similarity, k=5). A UMAP overlay shows the query vector and top-5 retrieved chunks coloured by rank.',
  },
  {
    step: 5,
    title: 'Generate',
    description:
      'LCEL chain pipes retriever, prompt, GPT-4o (temperature 0), and parser. Batch-invoked at max_concurrency=25.',
  },
  {
    step: 6,
    title: 'Evaluate',
    description:
      'Score a 20% sample with RAGAS using GPT-4o as judge across five retrieval and generation metrics.',
  },
] as const;

const FEATURES = [
  {
    title: 'LCEL Composition',
    description:
      'The chain is declarative: retriever, prompt, model, and parser compose with the pipe operator. The same shape gives you streaming, batching (used here at concurrency 25), and async for free, with no glue code.',
  },
  {
    title: 'Visual Retrieval Inspection',
    description:
      'UMAP plus Plotly turns FAISS from a black box into a 3D scatter you can rotate. Plotting the query alongside the index, with the top-5 retrieved chunks coloured by rank, makes "is the retriever actually pulling the right neighbours?" a glance instead of a spreadsheet exercise.',
  },
  {
    title: 'LLM-as-Judge Evaluation',
    description:
      'RAGAS uses GPT-4o itself to grade five facets: answer correctness, answer relevancy, context precision, context recall, and faithfulness. Splitting retrieval metrics (precision, recall) from generation metrics (faithfulness, relevancy) means a regression points at the right half of the system.',
  },
] as const;

const TECH_STACK = [
  'Python', 'Jupyter', 'LangChain', 'LCEL',
  'Azure OpenAI', 'GPT-4o', 'text-embedding-ada-002',
  'FAISS', 'RAGAS', 'tiktoken', 'UMAP', 'Plotly',
  'Hugging Face datasets', 'pandas', 'uv',
] as const;

const RESULTS = [
  {
    metric: 'Answer Correctness',
    score: '0.9373',
    note: 'Semantic + factual similarity to ground-truth answers.',
  },
  {
    metric: 'Answer Relevancy',
    score: '0.9735',
    note: 'How focused the answer is on the question (penalises incomplete or padded responses).',
  },
  {
    metric: 'Context Precision',
    score: '0.9017',
    note: 'Whether relevant chunks rank above irrelevant ones. A retrieval-quality signal.',
  },
  {
    metric: 'Context Recall',
    score: '1.0000',
    note: 'Every piece of ground-truth information was present somewhere in the retrieved chunks.',
  },
  {
    metric: 'Faithfulness',
    score: '0.9500',
    note: 'Answers stay consistent with the retrieved context, indicating minimal hallucination.',
  },
] as const;

const FUTURE_WORK = [
  'Tune chunk size and add overlap to lift context precision (currently the weakest metric at 0.90)',
  'Add a re-ranking model on top of FAISS retrieval to filter noisy top-k results',
  'Use document metadata (title, section) for hybrid filtering before vector search',
  'Replace the in-memory FAISS index with a persistent vector DB so embeddings survive across runs',
  'Wrap the chain in a small FastAPI service for an end-to-end interactive demo',
] as const;

const RagDemoPage = () => (
  <ProjectDetailLayout
    meta={META}
    seo={{
      title: 'RAG Demo: Retrieval-Augmented Generation on SQuAD',
      description:
        'End-to-end RAG pipeline on SQuAD with Azure GPT-4o, text-embedding-ada-002, FAISS, LangChain LCEL, and RAGAS evaluation, scoring 0.95 faithfulness and 1.00 context recall.',
    }}
    highlights={HIGHLIGHTS}
    overview={{
      title: 'About the Project',
      content: (
        <>
          <p>
            Large language models are powerful generators but unreliable knowledge stores.
            Ask one about a specific document, internal policy, or recent event and it will
            often confabulate. <strong>Retrieval-Augmented Generation (RAG)</strong> sidesteps
            this by retrieving relevant source material at query time and asking the model
            to answer <em>from that context</em>, rather than from memory.
          </p>
          <p>
            This notebook is a self-contained walkthrough of the full RAG loop on the{' '}
            <strong>Stanford Question Answering Dataset (SQuAD)</strong>: 100 crowd-sourced
            questions over Wikipedia passages about the University of Notre Dame, with
            ground-truth answers that make the system <em>evaluable</em>, not just
            demoable. The pipeline embeds chunks with Azure&apos;s{' '}
            <code>text-embedding-ada-002</code>, indexes them in FAISS, retrieves the top-5
            nearest neighbours, and feeds them into GPT-4o through a LangChain LCEL chain.
          </p>
          <p>
            Two ideas drive the project. First, <strong>LCEL</strong> makes the chain
            composable: retriever, prompt, model, and output parser line up with the pipe
            operator and you get batching, streaming, and async for free. Second,{' '}
            <strong>RAGAS</strong> turns &quot;is this RAG system good?&quot; into five
            concrete numbers that separate retrieval quality from generation quality, so a
            regression points at the right half of the pipeline. A companion presentation
            (<code>Rag_Presentation.pdf</code>) covers the same material at a higher level.
          </p>
        </>
      ),
    }}
    pipeline={{ title: 'How It Works', steps: PIPELINE_STEPS }}
    features={{ title: 'Why It Matters', ariaId: 'features-heading', cards: FEATURES }}
    beforeTech={
      <>
        <h2 id="viz-heading" className={`project-section-title ${styles.futureHeading}`}>
          Explore the Embedding Space
        </h2>
        <p className={styles.vizLead}>
          UMAP projects the 1536-dimensional Azure embeddings down to three dimensions so the
          FAISS index can be inspected directly. Drag to rotate, scroll to zoom, hover for the
          underlying chunk text.
        </p>
        <div className={styles.vizGrid}>
          <figure className={styles.vizCard}>
            <figcaption>
              <h3>Indexed chunks</h3>
              <p>Every Wikipedia chunk in the corpus, positioned by semantic similarity.</p>
            </figcaption>
            <PlotlyEmbed
              src={`${import.meta.env.BASE_URL}plots/encoding_plot.json`}
              poster={{
                light: `${import.meta.env.BASE_URL}plots/encoding_plot-light.webp`,
                dark: `${import.meta.env.BASE_URL}plots/encoding_plot-dark.webp`,
              }}
              ariaLabel="3D UMAP projection of embedded SQuAD chunks"
            />
          </figure>
          <figure className={styles.vizCard}>
            <figcaption>
              <h3>Query and top-5 retrievals</h3>
              <p>The query vector overlaid on the index, with the top-5 nearest neighbours coloured by rank.</p>
            </figcaption>
            <PlotlyEmbed
              src={`${import.meta.env.BASE_URL}plots/retrieval_visualization.json`}
              poster={{
                light: `${import.meta.env.BASE_URL}plots/retrieval_visualization-light.webp`,
                dark: `${import.meta.env.BASE_URL}plots/retrieval_visualization-dark.webp`,
              }}
              ariaLabel="3D UMAP projection showing query vector and top-5 retrieved chunks"
            />
          </figure>
        </div>

        <h2 id="results-heading" className={`project-section-title ${styles.futureHeading}`}>
          Evaluation Results
        </h2>
        <p className={styles.resultsLead}>
          RAGAS scored a 20% sample of the SQuAD questions using GPT-4o as the judge model.
          Each metric is on a 0–1 scale.
        </p>
        <div className={styles.resultsTableWrapper} role="region" aria-labelledby="results-heading">
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Score</th>
                <th scope="col">What it measures</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((r) => (
                <tr key={r.metric}>
                  <th scope="row">{r.metric}</th>
                  <td className={styles.scoreCell}>{r.score}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.resultsTakeaway}>
          High faithfulness and full context recall indicate the LLM is grounding answers in
          retrieved material rather than its own parametric memory. Context precision is the
          weakest score, and a clear lever for the next iteration.
        </p>

        <h2 id="future-heading" className={`project-section-title ${styles.futureHeading}`}>
          What&rsquo;s Next
        </h2>
        <ul className={styles.futureWorkList}>
          {FUTURE_WORK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    }
    techStack={TECH_STACK}
    afterTech={
      <div className={styles.projectLinks}>
        <a
          href="https://github.com/ianedmundson1/rag-demo"
          className={styles.projectLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source code on GitHub (opens in a new tab)"
        >
          View on GitHub
        </a>
      </div>
    }
  />
);

export default RagDemoPage;
