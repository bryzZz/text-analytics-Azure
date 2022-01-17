import axios from 'axios';
import { useState } from 'react';

const links = {
    keyPhrases:
        'https://exam-zeta.cognitiveservices.azure.com/text/analytics/v3.1/keyPhrases',
    sentiment:
        'https://exam-zeta.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/sentiment',
    entities:
        'https://exam-zeta.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/entities/recognition/general',
};

export const useTextAnalytics = () => {
    const [isLoading, setIsLoading] = useState(false);

    const makeRequest = (text, url, language = 'en') => {
        setIsLoading(true);

        const result = axios.post(
            url,
            {
                documents: [
                    {
                        id: '1',
                        language,
                        text,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key':
                        'c8802af8c44444429433e65bf36e6129',
                },
            }
        );

        result.then((res) => {
            setIsLoading(false);

            return res;
        });

        return result;
    };

    const getKeyPhrases = (text, language) => {
        return makeRequest(text, links.keyPhrases, language);
    };

    const getSentiment = (text, language) => {
        return makeRequest(text, links.sentiment, language);
    };

    const getEntities = (text, language) => {
        return makeRequest(text, links.entities, language);
    };

    const getAll = (text, language) => {
        return Promise.all([
            getKeyPhrases(text, language),
            getSentiment(text, language),
            getEntities(text, language),
        ]);
    };

    return { getKeyPhrases, getSentiment, getEntities, getAll, isLoading };
};
