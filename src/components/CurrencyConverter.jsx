import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Currency(props) {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get(`https://v6.exchangerate-api.com/v6/f5b469067ab6e4b999ec08eb/codes`);
                const currencyCodes = response.data.supported_codes;
                setCurrencies(currencyCodes);
            } catch (error) {
                console.error('Error fetching currency codes:', error);
                setError('Error fetching currency codes.');
            }
        };

        fetchCurrencies();
    }, [props.apiKey]);

    useEffect(() => {
        const getExchangeRate = async () => {
            try {
                const response = await axios.get(`https://v6.exchangerate-api.com/v6/f5b469067ab6e4b999ec08eb/pair/${fromCurrency}/${toCurrency}`);
                const rate = response.data.conversion_rate;
                setExchangeRate(rate);
                setError(null);
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
                setError('Error fetching exchange rate.');
            }
        };

        if (fromCurrency !== toCurrency) {
            getExchangeRate();
        } else {
            setExchangeRate(1);
        }
    }, [fromCurrency, toCurrency, props.apiKey]);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    };

    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    };

    const handleConvert = () => {
        if (!isNaN(amount) && exchangeRate) {
            const convertedValue = amount * exchangeRate;
            setConvertedAmount(convertedValue.toFixed(2));
        }
    };

    return (
        <section className='landing-section'>
            <div className="row container">
                <div className="form">
                    <h1 className='landing-heading'>Currency Converter</h1>

                    <div className='mb-2'>
                        <label className='form-label'>
                            Amount:
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                className='form-control'
                                placeholder="Enter amount"
                            />
                        </label>
                    </div>

                    <div className='mb-2'>
                        <label className='form-label'>
                            From Currency:
                            <select value={fromCurrency} onChange={handleFromCurrencyChange} className='form-select select-tag'>
                                {currencies.map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {code} - {name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className='mb-2'>
                        <label className='form-label'>
                            To Currency:
                            <select value={toCurrency} onChange={handleToCurrencyChange} className='form-select select-tag'>
                                {currencies.map(([code, name]) => (
                                    <option key={code} value={code}>
                                        {code} - {name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <button onClick={handleConvert} className='btn btn-success'>Convert</button>

                    {convertedAmount !== null && (
                        <div>
                            <p className='para'>
                                Converted Amount: {convertedAmount} {toCurrency}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div>
                            <p className='text-danger'>
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Currency;
