import { useState } from 'react';
import Tabs from '../Tabs/Tabs';
import { useTextAnalytics } from '../../hooks/useTextAnalytics';
import { camalCaseToNormalCase } from '../../utils';

import './style.css';

export default function App() {
    const [text, setText] = useState('');
    const [dataItems, setDataItems] = useState([]);
    const { getAll, isLoading } = useTextAnalytics();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text) return;

        getAll(text)
            // Primary data processing
            .then((results) => {
                console.log(results);

                let keyPhrases = results[0].data.documents[0].keyPhrases,
                    sentiment = results[1].data.documents[0].sentences,
                    entities = results[2].data.documents[0].entities;

                keyPhrases = Array.from(new Set(keyPhrases));
                sentiment = [
                    ...sentiment.filter(
                        (item) => item.sentiment === 'negative'
                    ),
                    ...sentiment.filter((item) => item.sentiment === 'neutral'),
                    ...sentiment.filter(
                        (item) => item.sentiment === 'positive'
                    ),
                ];
                entities = Array.from(
                    new Set(entities.map((entity) => entity.text))
                );

                return { keyPhrases, sentiment, entities };
            })
            // Transform data to html
            .then(({ keyPhrases, sentiment, entities }) => {
                if (keyPhrases.length === 0) {
                    keyPhrases = <h4>Nothing found</h4>;
                } else {
                    keyPhrases = (
                        <ul>
                            {keyPhrases
                                .sort((a, b) => a.length - b.length)
                                .map((phrase, index) => (
                                    <li key={index}>{phrase}</li>
                                ))}
                        </ul>
                    );
                }

                if (sentiment.length === 0) {
                    sentiment = <h4>Nothing found</h4>;
                } else {
                    sentiment = (
                        <ul>
                            {sentiment.map(({ sentiment, text }, index) => {
                                let color = '';

                                if (sentiment === 'negative') {
                                    color = 'red';
                                } else if (sentiment === 'positive') {
                                    color = 'lime';
                                }

                                return (
                                    <li key={index} style={{ color }}>
                                        {text}
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }

                if (entities.length === 0) {
                    entities = <h4>Nothing found</h4>;
                } else {
                    entities = (
                        <ul>
                            {entities.map((entity, index) => (
                                <li key={index}>
                                    <a
                                        href={
                                            'https://www.google.com/search?q=define%3A' +
                                            entity
                                        }
                                    >
                                        {entity}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    );
                }

                return { keyPhrases, sentiment, entities };
            })
            // Update state
            .then((results) => {
                const newDataItems = [];

                for (const key in results) {
                    newDataItems.push({
                        title: camalCaseToNormalCase(key),
                        data: results[key],
                    });
                }

                setDataItems(newDataItems);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let results = null;
    if (isLoading) {
        results = <p>loading...</p>;
    } else {
        results = dataItems.length > 0 && <Tabs items={dataItems} />;
    }

    return (
        <div className='App'>
            <div className='container'>
                <div className='wrapper'>
                    <form className='form' onSubmit={handleSubmit}>
                        <textarea
                            className='form__textarea'
                            placeholder='Enter text in English'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoCorrect='off'
                            autoCapitalize='none'
                            spellCheck='false'
                        ></textarea>
                        <button className='form__btn' disabled={!text}>
                            Submit
                        </button>
                    </form>

                    {results}
                </div>
            </div>
        </div>
    );
}
