import { h } from 'preact';
import { Suspense } from 'preact/compat';
import { usePrerenderData } from '@preact/prerender-data-provider';
import Markdown from 'markdown-to-jsx';
import { FormattedCodeBlock } from './formatted-code-block';

import style from './style';

const blogs = (props) => {
	const [data, isLoading] = usePrerenderData(props);
	return (
		<article class={style.blogcontainer}>
			{getBlogBody(data, isLoading)}
		</article>
	);
};

function CodeBlock(props) {
	const fallback = <pre><code>{props.children}</code></pre>;
	if (typeof window === 'undefined') {
		return (fallback);
	}
	return (
		<Suspense fallback={fallback}>
			<FormattedCodeBlock {...props} />
		</Suspense>
	);
}

function InlineImage({ alt, title, src }) {
	return (
		<div class={style.inlineImageContainer}>
			<img class={style.inlineImage} src={src} alt={alt} />
			{title && <span class={style.inlineImageTitle}>{title}</span>}
		</div>
	);
}

function getBlogBody(data, isLoading) {
	if (isLoading) {
		return (
			<div class={style.loadingPlaceholder}>
				<h1 class={`${style.blogtitle} loading`} >&nbsp;</h1>
				<caption class={`${style.blogsubtitle} loading`}>&nbsp;</caption>
				<div class={style.blogbody}>
					<div class={`${style.loadingBody} loading`} />
					<div class={`${style.loadingBody} loading`} />
					<div class={`${style.loadingBody} loading`} />
				</div>
			</div>
		);
	}

	if (data && data.data) {
		const { details, content } = data.data;
		console.log(details)
		return (
			<div>
				<h1 class={style.blogtitle}>{details.title}</h1>
				{ details.subtitle && <caption class={style.blogsubtitle}>{details.subtitle}</caption> }
				{ details.cover && <div class={style.blogcover} style={`background-image:url(${details.cover})`} /> }
				{ details.tables1 && 
				  <div style='background-color: gray'>
					<p>{details.tables1}</p>
				  </div>
				}
				{ details.tables2 && 
				  <div style='background-color: red'>
					<p>{details.tables2}</p>
				  </div>
				}
				<div class={style.blogbody}>
					<Markdown options={{
						overrides: {
							img: {
								component: InlineImage
							},
							code: {
								component: CodeBlock
							}
						}
					}}
					>{ content }</Markdown>
				</div>
			</div>
		);
	}
}

export default blogs;
