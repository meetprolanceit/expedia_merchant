const { axiosRequest } = require('../utils/axios.request');
const { createFCToken, createLoginFCToken } = require('../utils/getFcToken');
const browserIdentifier = '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"';
const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

const tokenPatterns = {
    loginTokenPattern: /"loginemail":"([^"]+)"/,
    DUAIdPattern: /DUAID=([a-f0-9\-]+)/,
    traceparentPattern: /"traceparent":"([^"]+)"/,
    setaccountinfoPattern: /"setaccountinfo":"([^"]+)"/,
    traceIdPattern: /"traceId":"([a-f0-9\-]+)"/,
    deviceUserAgentIdPattern: /"device-user-agent-id":"([a-f0-9\-]+)"/,
    setpasswordotp: /"setpasswordotp":"([^"]+)"/,
    ctxViewIdPattern: /"ctx-view-id":"([a-f0-9\-]+)"/,
    clientInfo: /"clientInfo":"([^\"]+)"/,
};

let globalUserDetails;
let globalDUAIdToken;
let globalverifyOtpCSRFToken;
let globalCookiesForLogin;
let globalClientInfo;
let globalCtxViewId;

const initialPageRender = async () => {
    try {
        const url = 'https://www.expedia.co.in/login?&uurl=e3id%3Dredr%26rurl%3D%2F';
        const headers = {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            cookie: '_dd_s=',
            pragma: 'no-cache',
            priority: 'u=0, i',
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': userAgent,
        };
        const config = {
            method: 'GET',
            url: url,
            headers: headers,
        };

        const response = await axiosRequest({ config });

        const initialPageCleanedResponseData = response['data'].replace(/\\"/g, '"');
        const initialPageCookies = response.headers['set-cookie'].map((el) => el.split('; ')[0]).join('; ');
        const loginCsrfToken = initialPageCleanedResponseData.match(tokenPatterns.loginTokenPattern)[1];

        const DUAIdToken = initialPageCleanedResponseData.match(tokenPatterns.DUAIdPattern)[1];
        globalDUAIdToken = DUAIdToken;

        const ctxViewId = initialPageCleanedResponseData.match(tokenPatterns.ctxViewIdPattern)[1];
        globalCtxViewId = ctxViewId;
        const clientInfo = initialPageCleanedResponseData.match(tokenPatterns.clientInfo)[1];
        globalClientInfo = clientInfo;
        const userAgentId = initialPageCleanedResponseData.match(tokenPatterns.deviceUserAgentIdPattern)[1];
        const xb3TraceId = response.headers['trace-id'];

        return { initialPageCookies, loginCsrfToken, DUAIdToken, ctxViewId, clientInfo, userAgentId, xb3TraceId };
    } catch (error) {
        console.log(`🚀 ~ initialPageRender ~ error:`, error);
        throw new Error(error);
    }
};

//function to send otp on email
const sendOtpOnEmail = async ({ userDetails, csrfToken, DUAIdToken, cookies, userAgentId, xb3TraceId }) => {
    try {
        const url = 'https://www.expedia.co.in/identity/email/otp/send';
        let data = JSON.stringify({
            username: userDetails.email,
            email: userDetails.email,
            resend: false,
            channelType: 'WEB',
            scenario: 'SIGNIN',
            atoShieldData: {
                atoTokens: {},
                placement: 'loginemail',
                csrfToken: csrfToken,
                devices: [
                    {
                        payload:
                            'eyJjb25maWd1cmVkRGVwZW5kZW5jaWVzIjpbeyJuYW1lIjoiaW92YXRpb25uYW1lIiwicGF5bG9hZCI6IjA0MDBpTVpWRHg4SjZ1TzVtWnd2VGZqRmU4YTh1WTlSaXhpRjlZOVVzTWhxRWUvcy8rVDBQWU5lSThDcTlESC9xSUZtcTVqZElQRzRrZmFFZjZMcVdXVms0d05FNitxcklKanhJS3dSK2NiOHBKbER5clhFczB5UEZ1ZjJ4UWIxdFc4bjZvcnU2WXhseHY5QzBRUWpwNmpjYmc1VDJhY0VVY1pYWDJ0TnpvcGhrMkN2dzdqTjIrVXpwOE5KaEk3SWFmY0ZEYVVUeFd4aG1EN3VsN3o2dlhva1drUjRGYlhlL1RMZUpDS2VQWEsrd3l5cXRlNUIySDJFd0Y0Q1QzUHFyTzNxazA3STlmQlZmUHlWNlIzZXJuZXE1eXlaV0hMRnZSVGRMTjc5eFBCRFMwVXpKSHdWVXBBTDNya0NKYTkxVUtxL3hWQVZpY1p0MFEvRUFZdlpZNU1pcFFYb2prNGJGOTFQT1YxK1piOHlXb2k1L1IyclRwenR3MXJCTVAyWEFEc1hwLzJZemY3RDFrZ0VMQ3crTVVKWTlYbmNqM3BiTzQzQlpSMVFlbklheU83dkprZHRQNkZxbitxWjFoSVdsUy9oTUxlanV0RzRoeExlcGY4MTBjbjlXU2dPK1VxcHhiKytLTmRkR3lKWHZvVURKSGVsUFBTekpSMWVCUHJmbHpKMFVWNjhxOUV1eUNpSXJ1a3dMRDNOMU9UUUhqeTdINVhoQm1TQ0dKWHpldmhQTDF5bWtOSzcvcnhVTjBzWUY4cjA4Zjh1Q2NDMHhPRFloOGVtTW53dVo1SlJteUMzY2ZjeFJXa1dIdTVnT3NXUU05c2FXWUZFY3J6Tk02ekJ5T0NQUWFmOTlFajBubkRkNXFxVEg2YnFxRFpLelNsRVROUm9obHo1d2xSRndXSmkwRlJ1bHJ1WFFZUW9ubXdST3VpQ2Z5Si9lZzhuTFY4SmRxSmF6WUZEVDh5eWVxMFpDTlBHSHJvQjFNVmJtalJZNEV3SXg5SnRiR2c0OEJBQTQ2TUI2eDJGSFh4b01aV0cycTBFdVJVbW5uTjFvdFE0aktJcm16NjF6aHpGQjFjbXV4ZkN5dHlZWWNqd2pzNUNhMi93QmRoaW05dksvVXNRNVhPWW0wT3FLYkF0amd6SE1HQWtMVExrRU40TDdFZkk4STdPUW10djhBWFlZcHZieXYxTEVPVnptSnREcWltd0xZNE14ekJnSkMweTVCRGVDK3hIeVBDT3prSnJiL0FGMkdLYjI4cjlTeGZ3S01jUklvZUpJTXlmQlNXdi92dW96WEtWQ3c5QUJmbWVHMm12V3RBMnZGUTNTeGdYeXZUeC95NEp3TFRFNE9zamFQL1BiYmpkUk9Oc3JObWxRMEYwS29lWEF2N0E5T3QreFZPTE1FQ1UxNXRGd2JiNU5rVnRyTkh6dDk1ZVBnWHMrb1FRYzYwdHJyR3RvNDRkRlovazBCNDh1eCtWNFN4d2h3Qm1OeWRJNlM2bGEwbGM3Q05Td2VqT1g1ZGhLREJBS0JJclJMYlJWS05RMFpGTFR4aHhVeU9vOGpLZExKRTc1YWdYUXRkajVtTlY2UXhnYmNsaGZJVWNGdXliTExOdlM5TEJaRUQ1b0hsTkp6RkdaZXhMSUJYM2sxT2hkdkFmekxYTlpLbVFqWE9lZTF5YUR4ZmhGZkVHWmZMcFZkaGVqY0ZNSmZhR1FucmdIU3VsSENaU0lwRGxXb09KNjFPZzNxa3VyVUZ5dFBYVlcxUndxaDl4dlBrOWZRTU1YY2NoWHhMaVFDV2xIa243K0dUbTZKME50ZGNJQ28vL0Nscjd3YkZDUDR3MkQxL1dVMnNTQXpQK0hYMW1PQWVZdko2Y0RLQXdqT3lTeFNqenRLME9wcWoxSGttb2h4amxZMWJFRVF1NlN1RUhHdVdPK1NWV1EvWExOSHY3NDE0Yldqb0VjZUVWUlkyU3NkVUJHMitEbDdUV2QrNlNYN1JjWTVQM1ZUZUsxQ1VhUTZnbHFTdmhqSFM3SkpiRW0va2dYNzFMNlE5OVNYTlRxbHIwMjgvM1BxL0YxRG5pT0x1Q2dFaVBLcE1WQlFuWlBESFpxSE5Dc0UvM1VBL1ZWYjdyZEpxTkFab1dKcEF1NWlxNnBaMVNYVWk1aDl1OEpGbnY0amF0eUhqOTNiVCtEb0thQWdVMXllNWpIenVLOFNIcnM5NGtydDRiVzZIeDcwelF6UEl5ZzVtN0JEN2tFWmFNVnB4WUFzTDBEU29XQ3BJS3Z6WEpiWWREdmZnMTJYdHQ5WUZrYjMyclE2SXpLRW9HZ0VnT05UYmJtK1VZSDRuL1VkUlpxMDhqdkNKRmJ2bzRVNGlmTU4yNUJpNkUzcUdEbnJYbXFxczdBUjY4V3RvbXpTYnUxeE5lY052VUxYczJtNmFvQUhZdDVZODlEZFdjOHQxMCtIeFJIZzkyQmpsQ29NMXorbi9YTDA4ZVNFSk1lRDR5elJEeXhES0pCcUJpY1QvWWRQZ04wMzJTT3ZJQTFFUWE2RlFzZld4ZlVLNXZJRzJXUyszU2htRVhicm5SUjFJOXVBdEZIQzhHblAzcXIvUFZKVzJycFhXK1FJT2pZb1FBNEtCaHh3a05CUTkxVkM4QjMxcitsME1USWlpY3BxLzRYRjVURlA3YjZ2OCtqTUh5VkwvQ2RGTG5GSEVyemI0aFRGUFdVTmpSKzd3SmoweUtwQ3dvcmpNQUh6Q01EMzRaTHVoZFRIWE9neUxjQzlZR0VKYjZ0ZHp2c1hqYXJqRzROWVIvOGdaSVBRS1YyLzZIbXpnNVFCOElNWndsM1NKUmdmTDZYR0tZa2Y4ZGpKam9lSU5LOWNadUoxVE4wYmRMTGdLMU8ycm1heW9XelRHM3JOL0xMQTJmLyt0aGdvVEh1N1NtSWlmL2lEdU1DZjg4TDJ5b0lPYXZSekdIUUtSaDJWZEoxV0VsWUszUFlpeXdYbHFkc3dkTk5WUUVxVStVZlNXUGJVQVlRa3krczhobXpkSlZwZUV0Y3NUZFRXV3QyankrUnE1b2EvMjI3K0owY1d4RTYzZkJKUkplSWM5V1U1MWxZMStyS0swMExOM05kMEE0alBPRGZRenNGbmxNa0NUSUxINGJHKzNaSkNMSTUwQ0VTNUh5NkJlaGpiMktPUnpvZHFvWkEvODhnVjFOdjI0V014V3BLWExpUFVET2g5MmlUSmFRNFNXc3hoeXpxVzRXRkpiNGFDbE9FdUNqY2c1VXg1OHJzUjdmdXFHTTJZYWkveVd0SmRUQkQzYkM4MzlhUWU0VDhseUsrRXNmWnBFSWhhREMzZXl6blBaTUdrNnFadkIwYWRHSWw5VDhoNUVBZ3RaNFozUHI5dFVQVzJYanVPZ2Z5amJWemJUTS8yZU5qeFFoOUx3UGhON3I2TWs4T2Vvcnl2TWdrR0wzZ0d1ZnRrU0wya3VYZmFadDNidzhrN0F0NFhpM0hET3JtYzJJdHRGY25WNEtLckNFVVF5SmFRZWRvT1hXRG1tWkNSdHE1eisxbGdwVEZqb2F5dGRWMGF0NEJ5MTZ6WjRQYTQyOFJBUnJmQ2U5L0lycUEzaUxHSWhyYmRRUXF2NFl0a3E0Rk10MnlTbFJ0bmRXTUg4Ukw3eUM3STA1Z1E9PSIsInN0YXR1cyI6IkNPTVBMRVRFIn1dLCJkaWFnbm9zdGljcyI6eyJ0aW1lVG9Qcm9kdWNlUGF5bG9hZCI6MTEzNiwiZXJyb3JzIjpbIkMxMTA0IiwiQzEwMDAiLCJDMTAwNCJdLCJkZXBlbmRlbmNpZXMiOlt7InRpbWVUb1Byb2R1Y2VQYXlsb2FkIjo1ODU1NCwiZXJyb3JzIjpbXSwibmFtZSI6ImlvdmF0aW9ubmFtZSJ9XX0sImV4ZWN1dGlvbkNvbnRleHQiOnsicmVwb3J0aW5nU2VnbWVudCI6IjI3LHd3dy5leHBlZGlhLmNvLmluLEV4cGVkaWEsVUxYIiwicmVxdWVzdFVSTCI6Imh0dHBzOi8vd3d3LmV4cGVkaWEuY28uaW4vbG9naW4/JnV1cmw9ZTNpZCUzRHJlZHIlMjZydXJsJTNEJTJGIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwicGxhY2VtZW50IjoiTE9HSU4iLCJwbGFjZW1lbnRQYWdlIjoiMjciLCJzY3JpcHRJZCI6IjY4YTAwYzAzLWUwNjUtNDdkMy1iMDk4LWRkODYzOGI0YjM5ZSIsInZlcnNpb24iOiIxLjAiLCJ0cnVzdFdpZGdldFNjcmlwdExvYWRVcmwiOiJodHRwczovL3d3dy5leHBlZGlhLmNvbS90cnVzdFByb3h5L3R3LnByb2QudWwubWluLmpzIn0sInNpdGVJbmZvIjp7fSwic3RhdHVzIjoiQ09NUExFVEUiLCJwYXlsb2FkU2NoZW1hVmVyc2lvbiI6MX0=',
                        type: 'TRUST_WIDGET',
                    },
                ],
            },
        });

        const headers = {
            accept: 'application/json',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            brand: 'expedia',
            'content-type': 'application/json',
            cookie: cookies,
            'device-type': 'DESKTOP',
            'device-user-agent-id': DUAIdToken,
            eapid: '0',
            origin: 'https://www.expedia.co.in',
            pointofsaleid: '',
            priority: 'u=1, i',
            referer: 'https://www.expedia.co.in/login?&uurl=e3id%3Dredr%26rurl%3D%2F',
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux   "',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            siteid: '27',
            tpid: '27',
            'trace-id': xb3TraceId,
            'user-agent': userAgent,
            'x-b3-traceid': xb3TraceId,
            'x-mc1-guid': DUAIdToken,
            'x-remote-addr': 'undefined',
            'x-user-agent': 'undefined',
            'x-xss-protection': '1; mode=block',
        };

        let config = {
            method: 'POST',
            url: url,
            data: data,
            headers: headers,
        };

        const response = await axiosRequest({ config });
        return response;
    } catch (error) {
        console.log(`🚀 ~ sendOtpOnEmail ~ error:`, error);
        throw new Error(error);
    }
};

//function to call api IdentityAuthenticateByOtpFormQuery
const identityAuthenticateByOtp = async ({ userDetails, DUAIdToken, cookies, ctxViewId, clientInfo }) => {
    try {
        const url = 'https://www.expedia.co.in/graphql';
        let data = JSON.stringify([
            {
                operationName: 'IdentityAuthenticateByOtpFormQuery',
                variables: {
                    request: {
                        emailInput: userDetails.email,
                        authenticationFlowVariant: 'DEFAULT',
                    },
                    context: {
                        siteId: 27,
                        locale: 'en_GB',
                        eapid: 0,
                        currency: 'INR',
                        device: {
                            type: 'DESKTOP',
                        },
                        identity: {
                            duaid: DUAIdToken,
                            authState: 'ANONYMOUS',
                        },
                        privacyTrackingState: 'CAN_TRACK',
                        debugContext: {
                            abacusOverrides: [],
                        },
                    },
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: '322c77986629ee14b9a808be8cc5a1311b7452f350833fe8b4e28604b433be28',
                    },
                },
            },
        ]);

        const headers = {
            accept: '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'client-info': 'eg-auth-ui-v2,8eb087574902cef0a5ee8fc94349ddaa9b007c77,us-west-2',
            'content-type': 'application/json',
            cookie: `${cookies}; bm_s=YAAQ8hzFF1ntKEWVAQAAy7YxXQOS43KhLcbTItbe7f6YO928oi311gIkkF0Hbkvc+lKTTbHHxsDnshVd0qKbPqnGYHlsxAEBf4MnJuWSbXNq7iYRLUqTucuIeoHr6cXYrvQ32fINjES5Dsl6RJuCbq1Kw4cCqFO7fkrOBf2y0d4HF4AcgY7D6MKo/+h74KJf1z8wXq+tUvEzDC/M2xuYJRSvmd5oMCDu+sXA+fNjG3BUEP/atDTV0pX75bih4A+V6nguo6DowN2rlRPPXcGm5jQtCfZHo3cXATvwiqeY6HIBtuxrzV3GeNCjJXERFbEWb5CzJQVugrxK5zre2R+LB5gMNd04tzkpkAOYYpAN2tASTHsDB7W9QX5+Nu8AaqsPNRzQqxhCzKqHxGhVQ3D9y44xqDpN38AlAh/07maujsrY8DoMfSosoTxrAY5qvmUqjJMTB7B5QrHX;`,
            // cookie: cookies,
            'ctx-view-id': ctxViewId,
            origin: 'https://www.expedia.co.in',
            priority: 'u=1, i',
            referer: 'https://www.expedia.co.in/verifyotp?uurl=e3id%3Dredr%26rurl%3D%2F&scenario=SIGNIN&path=email',
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': userAgent,
            'x-hcom-origin-id': 'Login',
            'x-page-id': 'Login',
        };
        let config = {
            method: 'POST',
            url: 'https://www.expedia.co.in/graphql',
            headers: headers,
            data: data,
        };

        const response = await axiosRequest({ config });

        globalCookiesForLogin = response.headers['set-cookie'].map((el) => el.split('; ')[0]).join('; ');
        // ${initialPageCookies}
        // const responseJsonData = JSON.parse(response.data);
        globalverifyOtpCSRFToken =
            response.data[0].data.identityAuthenticateByOTPForm.continueButton.action.accountTakeOverWidgets[0].token;
        return response;
    } catch (error) {
        console.log(`🚀 ~ identityAuthenticateByOtp ~ error:`, error);
        throw new Error(error);
        // return { message: error.body, status: error.statusCode };
    }
};

//call otp verify api
const otpVerify = async ({
    DUAIdToken,
    userDetails,
    csrfToken,
    fcToken,
    otpDetails,
    clientInfo,
    cookies,
    ctxViewId,
}) => {
    try {
        const url = 'https://www.expedia.co.in/graphql';
        let data = JSON.stringify([
            {
                operationName: 'IdentityVerifyOTPAuthenticationSubmit',
                variables: {
                    context: {
                        siteId: 27,
                        locale: 'en_GB',
                        eapid: 0,
                        currency: 'INR',
                        device: {
                            type: 'DESKTOP',
                        },
                        identity: {
                            duaid: DUAIdToken,
                            authState: 'ANONYMOUS',
                        },
                        privacyTrackingState: 'CAN_TRACK',
                        debugContext: {
                            abacusOverrides: [],
                        },
                    },
                    request: {
                        verifyOTPContext: null,
                        emailInput: userDetails.email,
                        loginReferenceId: null,
                        referenceId: '',
                        identitySocialType: null,
                        rememberMe: true,
                        atoInputs: [
                            {
                                type: 'CSRF',
                                inputs: [
                                    {
                                        key: 'token',
                                        value: csrfToken,
                                    },
                                ],
                            },
                            {
                                type: 'CAPTCHA_WEB',
                                inputs: [
                                    {
                                        key: 'fc-token',
                                        value: fcToken,
                                    },
                                ],
                            },
                            {
                                type: 'TRUST_WIDGET',
                                inputs: [
                                    {
                                        key: 'payload',
                                        value: 'eyJjb25maWd1cmVkRGVwZW5kZW5jaWVzIjpbeyJuYW1lIjoiaW92YXRpb25uYW1lIiwicGF5bG9hZCI6IjA0MDBSNWxMQzlVUm9GNjVtWnd2VGZqRmU4YTh1WTlSaXhpRjFTWE5CZTNZdEhXcGQxdmY1clAzcThDcTlESC9xSUZtcTVqZElQRzRrZllmQlpIQU4xQ1lxakF5VnBDa3BIZjhJS3dSK2NiOHBKbER5clhFczB5UEZ1ZjJ4UWIxdFc4bmNiTEFPUnhYTGZBQmVCMWxFL2dmVkpmK1o5TzZBbU45a3lZU2Q5MWxBRmVHcHhsRDZpeHVLbGZ5VFpZbStvYXhhSFVsN1p2c3ByUEZkYW5qT2V3ZW9ZZ0lTTmNGajZ0L09pbmxyTVZMNTYwQXZ5cmlMZXdVN25Ba0lNbUR3SDkrZU00Zkt1cHdDM0krbjRWYlIwQnVKWmo1U25nWVRET0FYWEZOdkpucTNEd3pKSHdWVXBBTDNteFJvZ1FpTFp6RTM4TlhrdDRpK0liRUFZdlpZNU1pcFFYb2prNGJGOTFQT1YxK1piOHlXb2k1L1IyclRwenR3MXJCTVAyWEFEc1hwLzJZemY3RDFrZ0VMQ3crTVVKWTlYbmNqM3BiTzQzQlpSMVFlbklheU83dkprZHRQNkZxbitxWjFoSVdsUy9oTUxlanV0RzRoeExlcGY4MTBjbjlXU2dPK1VxcHhiKytLTmRkR3lKWHZvVURKSGVsUFBTekpSMWVCUHJmbHpKMFVWNjhxOUV1eUNpSXJ1a3dMRDNOMU9UUUhqeTdINVhoQm1TQ0dKWHpldmhQTDF5bWtOSzcvcnhVTjBzWUY4cjA4Zjh1Q2NDMHhPRFloOGVtTW53dVo1SlJteUMzY2ZjeFJXa1dIdTVnT3NXUU05c2FXWUZFY3J6Tk02ekJ5T0NQUWFmOTlFajBubkRkNXFxVEg2YnFxRFpLelNsRVROUm9obHo1d2xSRndXSmkwRlJ1bHJ1WFFZUW9ubXdST3VpQ2Z5Si9lZzhuTFY4SmRxSmF6WUZEVDh5eWVxMFpDTlBHSHJvQjFNVmJtalJZNEV3SXg5SnRiR2c0OEJBQTQ2TUI2eDJGSFh4b01aV0cycTBFdVJVbW5uTjFvdFE0aktJcm16NjF6aHpGQjFjbXV4ZkN5dHlZWWNqd2pzNUNhMi93QmRoaW05dksvVXNRNVhPWW0wT3FLYkF0amd6SE1HQWtMVExrRU40TDdFZkk4STdPUW10djhBWFlZcHZieXYxTEVPVnptSnREcWltd0xZNE14ekJnSkMweTVCRGVDK3hIeVBDT3prSnJiL0FGMkdLYjI4cjlTeGZ3S01jUklvZUpJTXlmQlNXdi92dW96WEtWQ3c5QUJmbWVHMm12V3RBMnZGUTNTeGdYeXZUeC95NEp3TFRFNE9zamFQL1BiYmpkUk9Oc3JObWxRMEYwS29lWEF2N0E5T3QreFZPTE1FQ1UxNXRGd2JiNU5rVnRyTkh6dDk1ZVBnWHMrb1FRYzYwdHJyR3RvNDRkRlovazBCNDh1eCtWNFN4d2h3Qm1OeWRJNlM2bGEwbGM3Q05Td2VqT1g1ZGhLREJBS0JJclJMYlJWS05RMFpGTFR4aHhVeU9vOGpLZExKRTc1YWdYUXRkajVtTlY2UXhnYmNsaGZJVWNGdXliTExOdlM5TEJaRUQ1b0hsTkp6RkdaZXhMSUJYM2sxT2hkdkFmekxYTlpLbVFqWE9lZTF5YUR4ZmhGZkVHWmZMcFZkaGVqY0ZNSmZhR1FucmdIU3VsSENaU0lwRGxXb09KNjFPZzNxa3VyVUZ5dFBYVlcxUndxaDl4dlBrOWZRTU1YY2NoWHhMaVFDV2xIa243K0dUbTZKME50ZGNJQ28vL0Nscjd3YkZDUDR3MjZQQngvSDhJTWl1aFRaM3d5Z1M3eU12T3VZRURLYnNOS1NVazdYblZudU1iQ3YzbVBaTjdERUpSNVZBUGthb0Q3cm5uM3ExZFlWRExOSHY3NDE0YldySkQvTnpmMVc0blZHbmRVdFk0ZjhpVHBsOHpkSkVaQ0dMMmZQZStyTU1aQUprbUZpREVIbEgvZ1ZFVFBXVUJzQzMrNVFBeWlWVnlxbHIwMjgvM1BxL0YxRG5pT0x1Q2dFaVBLcE1WQlFuWlBESFpxSE5Dc0UvM1VBL1ZWYjdyZEpxTkFab1dKcEF1NWlxNnBaMVNYVWk1aDl1OEpGbnY0amF0eUhqOTNiVCtEb0thQWdVMXllNWpIenVLOFNIcnM5NGtydDRiVzZIeDcwelF6UEl5ZzVtN0JEN2tFWmFNVnB4WUFzTDBEU29XQ3BJS3Z6WEpiWWREdmZnMTJYdHQ5WUZrYjMyclE2SXpLRW9HZ0VnT05UYmJtK1VZSDRuL1VkUlpxMDhqdkNKRmJ2bzRVNGlmTU4yNUJpNkUzcUdEbnJYbXFxczdBUjY4V3RvbXpTYnUxeE5lY052VUxYczJtNmFvQUhZdDVZODlEZFdjOHQxMCtIeFJIZzkyQmpsQ29NMXorbi9YTDA4ZVNFSk1lRDR5elJEeXhES0pCcUJpY1QvWWRQZ04wMzJTT3ZJQTFFUWE2RlFzZld4ZlVLNXZJRzJXUyszU2htRVhicm5SUjFJOXVBdEZIQzhHblAzcXIvUFZKVzJycFhXK1FJT2pZb1FBNEtCaHh3a05CUTkxVkM4QjMxcitsME1UQ0NlanFZUHVzYlMvcE4xTGVqRm9Ed0VzZUJ3TlVuQ3pnZmJDNmQ1eWRZaG5wY0Ird3VPUzF6SjZFRWNTc2dUY2huejhBeFJ6OTViUThKRndCdEpSYjhKeGZHcVk1WEFrQ2hvdmJXVlZ1MkJUQU8vK2w5MHY5djZIbXpnNVFCOElNWndsM1NKUmdmSUsyL2xYSkQrRG9TaEtsQ0N3Y1ltbXdubU8vdWo1d1BFekZCMTh4WFhkOUlTVjRoZTYvZzFGSUJBMzdkSm5CU3ltSWlmL2lEdU1DZjg4TDJ5b0lPYXZSekdIUUtSaDJWZEoxV0VsWUszUFlpeXdYbHFkc3dkTk5WUUVxVStVZlNXUGJVQVlRa3krczR0VVIvUWVKVk15elM1ZmZLYmttaXVRTFhCMmVPK28rZjRTU2pwc3RQd3BKa3pDak5NY2VrSXkvdEhmcmVvaUdiK0xxUGVEbitJd0tUTHRjbkRGZTRZcDM3WHkwRjlsUUJWWlExaU5rTG81ZkdHa0pWN3N5OWpNd1RTQm9kQ1ByUnZObFNEVit5ZVg3N2JTWnRhV2l1ZCtncHJJTFg5R2VkeGhWN1RaU3VqdXk3QWFFQklHUWM0Qm9rM2wzNHg2blV1MW5xQU9NY3dLSmRUQkQzYkM4MzlhUWU0VDhseUsrRXNmWnBFSWhhRENMM1RWYVg4RVIxbXFadkIwYWRHSWwremNTbVVPNWs5bVZPYVRveXpKK2R0NWlTdUFJa2xGcnJ6d2N1dm5idThLU2N4WVhzYmtIc3pZeXREUCtRQTI1bHc2ZmRTWmdIVllUbFJOZXBOaEJHb2k2UE5zNDNSdzdHdXNBbDZVcmpwU3d4N3ZCUEpOeE1qQmtiNE1yVm9EcGREUi9aQ3VaMC9Hd1dCK05Bak92cG9WU2s0MmRENEtoeVkrdStOcXMzNG1QUXNJck1EY04yZHMvTXZNdVcrOWowbS8rSkp3aTJqSGFEYjhJWGgyWS9neXk3NHpudlRubWlXTEZOaC8zcmtEZ0sveVRsS29PRWRPbWdOMjU4VHRPKzFLd05JaCtDbjkiLCJzdGF0dXMiOiJDT01QTEVURSJ9XSwiZGlhZ25vc3RpY3MiOnsidGltZVRvUHJvZHVjZVBheWxvYWQiOjEwOTQsImVycm9ycyI6WyJDMTEwNCIsIkMxMDAwIiwiQzEwMDQiXSwiZGVwZW5kZW5jaWVzIjpbeyJ0aW1lVG9Qcm9kdWNlUGF5bG9hZCI6NjcwOTMsImVycm9ycyI6W10sIm5hbWUiOiJpb3ZhdGlvbm5hbWUifV19LCJleGVjdXRpb25Db250ZXh0Ijp7InJlcG9ydGluZ1NlZ21lbnQiOiIyNyx3d3cuZXhwZWRpYS5jby5pbixFeHBlZGlhLFVMWCIsInJlcXVlc3RVUkwiOiJodHRwczovL3d3dy5leHBlZGlhLmNvLmluL2xvZ2luPyZ1dXJsPWUzaWQlM0RyZWRyJTI2cnVybCUzRCUyRiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChpUGhvbmU7IENQVSBpUGhvbmUgT1MgMTVfMCBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC82MDMuMS4zMCAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vMTcuNSBNb2JpbGUvMTVBNTM3MGEgU2FmYXJpLzYwMi4xIiwicGxhY2VtZW50IjoiTE9HSU4iLCJwbGFjZW1lbnRQYWdlIjoiMjciLCJzY3JpcHRJZCI6IjY4YTAwYzAzLWUwNjUtNDdkMy1iMDk4LWRkODYzOGI0YjM5ZSIsInZlcnNpb24iOiIxLjAiLCJ0cnVzdFdpZGdldFNjcmlwdExvYWRVcmwiOiJodHRwczovL3d3dy5leHBlZGlhLmNvbS90cnVzdFByb3h5L3R3LnByb2QudWwubWluLmpzIn0sInNpdGVJbmZvIjp7fSwic3RhdHVzIjoiQ09NUExFVEUiLCJwYXlsb2FkU2NoZW1hVmVyc2lvbiI6MX0=',
                                    },
                                ],
                            },
                        ],
                        oneTimePasscode: otpDetails.otp,
                        flowScenario: 'SIGNIN',
                        referrerURL: '/',
                        emailMarketingConsent: null,
                    },
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: '51714c0d860025ef1a51a609f67c95b97ad6f7d4a1db5ae81e86685f1827423a',
                    },
                },
            },
        ]);

        const headers = {
            accept: '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'client-info': 'eg-auth-ui-v2,8eb087574902cef0a5ee8fc94349ddaa9b007c77,us-west-2',
            'content-type': 'application/json',
            cookie: `${cookies}`,
            'ctx-view-id': ctxViewId,
            origin: 'https://www.expedia.co.in',
            priority: 'u=1, i',
            referer: 'https://www.expedia.co.in/verifyotp?uurl=e3id%3Dredr%26rurl%3D%2F&scenario=SIGNIN&path=email',
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': userAgent,
            'x-hcom-origin-id': 'Login',
            'x-page-id': 'Login',
        };

        let config = {
            method: 'POST',
            url: url,
            headers: headers,
            data: data,
        };

        const response = await axiosRequest({ config });
        const eventName = response.data[0].data.identityVerifyOTPAuthenticationSubmit.analytics[0].eventName;

        console.log(`🚀 ~ response:`, JSON.stringify(response.data));
        if (eventName == 'form.succeeded') {
            const status = response.status;
            let accountmergeRedirectUrl;
            if (response?.data[0]?.data) {
                accountmergeRedirectUrl = new URL(
                    response.data[0].data.identityVerifyOTPAuthenticationSubmit.redirectURL
                );
            }
            const cmsToken = accountmergeRedirectUrl?.searchParams?.get('token');
            const verifiedOtpCookies = response.headers['set-cookie'].map((el) => el.split('; ')[0]).join('; ');
            return { status, cmsToken, cookies: verifiedOtpCookies };
        } else {
            return { sataus: 400, message: 'Something wen worng please try again' };
        }
    } catch (error) {
        console.log(`🚀 ~ otpVerify ~ error:`, error);
        return { message: error.message, status: error.status };
    }
};

//function that use  to call accountmeregmutaion api.
const accountmeregmutaion = async ({ DUAIdToken, cmsToken, cookies, clientInfo }) => {
    try {
        const url = 'https://www.expedia.co.in/graphql';
        let data = [
            {
                operationName: 'accountmergemutation',
                variables: {
                    context: {
                        siteId: 27,
                        locale: 'en_GB',
                        eapid: 0,
                        tpid: 27,
                        currency: 'INR',
                        device: {
                            type: 'DESKTOP',
                        },
                        identity: {
                            duaid: DUAIdToken,
                            authState: 'ANONYMOUS',
                        },
                        privacyTrackingState: 'CAN_TRACK',
                        debugContext: {
                            abacusOverrides: [],
                        },
                    },
                    accountMergeContext: {
                        referrerURL: '/',
                        cmsToken: cmsToken,
                        flowIdentifier: 'ONE_IDENTITY_0',
                        scenario: 'SIGNUP',
                    },
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: 'e460cd939189a3fdea559e17e38fc7d2cd28c90dd853ee10b8f642c62f2b9ade',
                    },
                },
            },
        ];
        const headers = {
            accept: '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'client-info': 'eg-auth-ui-v2,8eb087574902cef0a5ee8fc94349ddaa9b007c77,us-west-2',
            'content-type': 'application/json',
            Cookie: cookies,
            origin: 'https://www.expedia.co.in',
            priority: 'u=1, i',
            referer: `https://www.expedia.co.in/accountmerge?redirectTo=%2F&scenario=SIGNUP&variant=ONE_IDENTITY_0&token=${cmsToken}`,
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': userAgent,
            'x-hcom-origin-id': 'AccountMerge',
            'x-page-id': 'AccountMerge',
        };
        let config = {
            method: 'POST',
            url: url,
            data: data,
            headers: headers,
        };

        const response = await axiosRequest({ config });
        console.log(`🚀 ~ accountmeregmutaion ~ response:`, response);
        return {
            profileDeatilsURL: response.data[0].data.identityMarkJourneyComplete.redirectURL,
            cookies: response.headers['set-cookie'].map((el) => el.split('; ')[0]).join('; '),
        };
    } catch (error) {
        console.log(`🚀 ~ accountmeregmutaion ~ error:`, error);
        throw new Error(error);
    }
};

//render the profile details page
const profileDeatilsPage = async ({ cmsToken, cookies }) => {
    try {
        const url = `https://www.expedia.co.in/accountinfo?redirectTo=%2F&scenario=SIGNUP&variant=PROFILE_DETAIL_0&token=${cmsToken}`;
        const headers = {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            cookie: cookies,
            priority: 'u=0, i',
            referer: `https://www.expedia.co.in/accountmerge?redirectTo=%2F&scenario=SIGNUP&variant=ONE_IDENTITY_0&token=${cmsToken}`,
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'sec-fetch-user': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': userAgent,
        };

        let config = {
            method: 'GET',
            url: url,
            headers: headers,
        };

        const response = await axiosRequest({ config });
        const profileDetailsPageResponseData = response['data'].replace(/\\"/g, '"');

        const setaccountinfoCsrfToken = profileDetailsPageResponseData.match(tokenPatterns?.setaccountinfoPattern)[1];
        const userAgentId = profileDetailsPageResponseData.match(tokenPatterns?.deviceUserAgentIdPattern)[1];
        const setaccountinfoTraceId = profileDetailsPageResponseData.match(tokenPatterns.traceIdPattern)[1];
        return { csrfToken: setaccountinfoCsrfToken, userAgentId, traceId: setaccountinfoTraceId };
    } catch (error) {
        console.log(`🚀 ~ profileDeatilsPage ~ error:`, error);
        throw new Error(error);
    }
};

//function for account deatils api call
const setAccountDeatils = async ({ DUAIdToken, csrfToken, cmsToken, userDetails, cookies }) => {
    try {
        const url = 'https://www.expedia.co.in/graphql';
        let data = [
            {
                operationName: 'userDetailsAndConsentSubmitMutation',
                variables: {
                    context: {
                        siteId: 27,
                        locale: 'en_GB',
                        eapid: 0,
                        tpid: 27,
                        currency: 'INR',
                        device: {
                            type: 'DESKTOP',
                        },
                        identity: {
                            duaid: DUAIdToken,
                            authState: 'ANONYMOUS',
                        },
                        privacyTrackingState: 'CAN_TRACK',
                        debugContext: {
                            abacusOverrides: [],
                        },
                    },
                    request: {
                        atoInputs: [
                            {
                                type: 'CSRF',
                                inputs: [
                                    {
                                        key: 'token',
                                        value: csrfToken,
                                    },
                                ],
                            },
                        ],
                        cmsToken: cmsToken,
                        emailMarketingConsent: true,
                        firstName: userDetails.firstName,
                        flowVariant: 'PROFILE_DETAIL_0',
                        lastName: userDetails.lastName,
                        referrerURL: '/',
                        scenario: 'SIGNUP',
                    },
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: '4e501df847c3fd431f88e3d13a4b696d30584be6587d3f7e2289b5a3d103dfab',
                    },
                },
            },
        ];

        const headers = {
            accept: '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'client-info': 'eg-auth-ui-v2,8eb087574902cef0a5ee8fc94349ddaa9b007c77,us-west-2',
            'content-type': 'application/json',
            cookie: cookies,
            origin: 'https://www.expedia.co.in',
            priority: 'u=1, i',
            referer: `https://www.expedia.co.in/accountinfo?redirectTo=%2F&scenario=SIGNUP&variant=PROFILE_DETAIL_0&token=${cmsToken}`,
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': userAgent,
            'x-remote-addr': 'AccountInfo',
            'x-user-agent': 'AccountInfo',
        };
        let config = {
            method: 'POST',
            url: url,
            data: data,
            headers: headers,
        };

        const response = await axiosRequest({ config });
        console.log(`🚀 ~ setAccountDeatils ~ response:`, response, JSON.stringify(response.data));
        return response;
    } catch (error) {
        console.log(`🚀 ~ setAccountDeatils ~ error:`, error);
        throw new Error(error);
    }
};

//set password page render
const setPasswordPage = async ({ cmsToken, cookies }) => {
    try {
        const url = `https://www.expedia.co.in/addpassword?redirectTo=%2F&scenario=SIGNUP&variant=PASSWORD_3&token=${cmsToken}`;
        const headers = {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            referer: `https://www.expedia.co.in/accountinfo?redirectTo=%2F&scenario=SIGNUP&variant=PROFILE_DETAIL_0&token=${cmsToken}`,
            cookie: cookies,
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': userAgent,
        };
        let config = {
            method: 'GET',
            url: url,
            headers: headers,
        };

        const response = await axiosRequest({ config });
        const clearResponseData = response['data'].replace(/\\"/g, '"');
        const setPasswordCsrfToken = clearResponseData.match(tokenPatterns.setpasswordotp)[1];
        const setPasswordTrcaeId = clearResponseData.match(tokenPatterns.traceIdPattern)[1];
        return { setPasswordCsrfToken, setPasswordTrcaeId };
    } catch (error) {
        console.log(`🚀 ~ setPasswordPage ~ error:`, error);
        throw new Error(error);
    }
};

//api call for set password
const setpasswordotp = async ({ csrfToken, userDetails, cmsToken, userAgentId, traceId, cookies }) => {
    try {
        console.log(`🚀 ~ setpasswordotp ~ { csrfToken, userDetails, cmsToken, userAgentId, traceId, cookies }:`, {
            csrfToken,
            userDetails,
            cmsToken,
            userAgentId,
            traceId,
            cookies,
        });

        const url = 'https://www.expedia.co.in/identity/v1/user/password';
        let data = JSON.stringify({
            atoShieldData: {
                atoTokens: {},
                placement: 'setpasswordotp',
                csrfToken: csrfToken,
                devices: [
                    {
                        payload:
                            'eyJjb25maWd1cmVkRGVwZW5kZW5jaWVzIjpbeyJuYW1lIjoiaW92YXRpb25uYW1lIiwicGF5bG9hZCI6IjA0MDByTE5lalRSOEZrdVZlYkthdGZNaklPdHZPcFFHVk1yeEExTjBnWkN6dElYWW5vUXFOd29yZW93c3JFeHpUZGZkZmlCVnZHc0Q2TWg5OFNKWTNSd0kzR1RtT3FMQTNTblJ1TkljRnlER2I3NDJIWSsxdUdjYlFCWjRmNzgvd3NyS2c4Vkt2ck1MMFFzR1o4dHNGOXV4TWxBUC90YnNWTmtrOFZXbzRvMS82SlNmSWdDWmNDWUVlaW9QZm1Gc01NRDNNc3dNN2VTWmtZRTBEQ2R1S1E2eFltLzlsS2xHRHNpUElOUUxjUGFyY2xzaGRacWtmZTBZeS82YSs5YUErZXRhS2g2TUt5bEVLSnhuNE9BTUVkWXQ5bEtNVCtLMmx1alBUbjNTY2ZyQmZZUzQwaHdYSU1adnZqWWRqN1c0Wnh0QUZuaC92ei9DeXNxRHhVcStzd3ZSQ3dabnkyd1gyN0V5VUEvKzF1eFUyU1R2VVNiSitMdHozUjMrMWxMWXFIWkVraHJadDI0MEhhcmhYKytwbTdYemdXRU9NVXcvb1RWTjA2S0x6emMzVzVBdUR6VVZKK0ZiRzVjeEIxeWl2ZmtyMU1mL0Vya1VvNUJYZXQwUThyS052QWs0VDBOeHEwaU9zMEp2dDZvUS9aTDJHQUxhMlFjMjJRUTFWWnArc01TMG9yU3BRTnVZa3ZqZDBId1pGWnNvSTM0UnZ5OGpVOS9veFM5R1RHUS9QWEVJc1RnQ1IwYzRXWXMvL0JQZDYxcWZPbU1PckhaOFJ6OThBZTBtaC9PU1pzZ0gxREdlU3loYWhaZk5RZ3UrbG1TbDJwS0FtdTF3bHVDSVNhenM5UEQ4My9zZUtjT2x2WHJHeGhLYXV3cUVXTHhVTjBzWUY4cjA4Zjh1Q2NDMHhPRGNiK0NxTUtFNnZRY05WQkVBM2ZCcm95SUhQTXNNM2ttV01DVmJCY2R4UDBvVVdmRXdmNVpac1FrcmN4REtRMjNGNzE4TVVSTnRXZ0llZnFRdDhyS1VmVTVJUlVVeVFKd21JTnNKOVZsTVlHVFgyM0kyenVEekJERkxITSs1RzNKeHZRZmtpTWVRSndwS3pncFZnb0hpbGZLZGhGUXJEb2JVSGhzQW5nZUMzblRjcGlFNXhFTGxKUzl3enNBSmRJWmM2bmpKZ1FoLzRtSGszQzdYSG84Z093T3dkODM2NkJtQkdBMzVud2NBV0VZWE4zK2JxeWRXQzF5ZFRta1Y2U0lIeWY4M0pQa0JBa1JhSDRsVnVsQThnUmdOK1o4SEFGaEdGemQvbTZzblZndGNuVTVwRmVraUI4bi9OeVQ1QVFKRVdoK0pWYnBRUElFWURmbWZCd0JZUmhjM2Y1dXJKMWEyblE5Z2RMT1FkbzF6bm50Y21nOFg0Ulh4Qm1YeTZWV2NpUkxjM2dqc3doVWhjN21QWnVxUk9ISGQxOUk4eFQ2dmxjZXR4ZW5vRGQ3dVc0ZktyVGpHWVNxRWs5SFlUZ2pna2xOS0dUMWpSSHhmWVYzV2VBMFVQUEsxRTErR0dkOXBMTEdWUVVLSVlSMndUdzUzQ2lXSy9YUVhpSEs1UDVuVzhrNmtPWWxpQnJJK3ZTM3pPMVVXS3lOUlhoMG13N0tiMXg0Y01wRUtJcmpFalZGTWhnTHlpNFB2V29JcHlabXByNXpsUXg5MHMxZW92UDdXK1dwUUN2MTBUYU54K1hUQ0N1aEFGK25LNGpjK0lvQU9SNzZHQU9YRGFVL2xidHBVZ0JidTROQ05jOG5rcGs1ajd3N1pubVZzckJ1UmpWWXVJc1Fuak0xT2VmWFJzUmFHVlk1MnpMMGZIRWFMbTJURXBrV1Rsbk1pNWtMZlc3SXJqREljaWRROXlsYkhyWFNSejhacktJS2M5VFJNWW5zRnZyaFF2cE52NG9QUmNlNWZEY0ZBbmNORmtLQ3NnWHFFVldUVFJoaGFpOXZpMHkrSmRLTFhyVGQ0USttekRHSlNGWmFIeVp0UllOblRXRW13TzAvcFFsaDFrMkZ5NmY1Q1EzWXRtbE5HTkFETStEampSWEkzamwyVDJyUkgwT0lYWU9NTmtrSWtET0Y2QjVYSng2WnJIS3dwVHFtMmc3ZUsxcGJZbnNLS3IxczVrYWV6SFA0WmRscEJhaFc4aE5lb29uOTJqb2ZaYlIyWDBDS1JPTXF3V2FoMXRveDRPa0RaUzFxcDQ2NXo3YS84Tkk3ZDZXZjFycm1sRUx1b1dod29nelJJOE1XZWFuYTEzZ29WVFVYTTFPdWhyWitDZ0ZreDlGcTBGVGpzTWpEejNMS1NMSm9aWUdmcWxhbWhKVFZDcjVyU1ZYdkdTVWF1ZXVMQ3ViRHAzU3dqUCtLMGZ4TUkyYmI5KzV3b2RPVjhBSVpjQkVxUTUreGp5QzFlWmRqcHVtdDM5VFUyZ3N2d0pQaEF2cDdETnZrR0liUmUwQ3VvT2hHZ2EvbDVOL2pJNXA0L1JUOHUyTk1GZHRaMTRacXpMcU5ZZWRHOXQ4N1dtaERkN2hLSzRld0ZuRlZYa01KR2xaQXNCMkdEWGNqcGdoa2liaGgyM3J6YnJZa0ZXZ1pXSkZaYk5OTHV1UDgyQXh0NjhOR251R2d1czFONXcwU0tLR3JjcEsyVmVpNFZ5TEF6aWQ1K2F0ckRJLzM0RnF1RzNpdDhXbnZlOGJBYXEycEhCald0ei9zL0xxQ21WU0VIMStvbzgvVDZCZFdXNTJrR2VObkladTVybTFKN2VBYWkzRDNBZEFOZnpHR292c1lia2owZEtXWFgxSHd2WkhjQ3V4SEtpVDZBU1BlMjRzekZRRURZU1BVcVFrcWJaNGdzVU93VWdhcE9TaitzZ1llcHpBS1pueHBSMkpWR2E1ZnBvWEJDd25QaGlJM1BwSk1hWHR0cURnNzBlZGJWc0NOblY0REd1c3pPVHFOTlRhOEhHU2l6enRlVXhUTTZramJ4aU15SjEzZDNBejRFRm5hQWJPam1OY0pZVkxMdlQxU3RlY2RraW4xR29OcW04amhRZktvSCs4RStOWmg4M2ZOUlR0Smd5Q2tBSndJK0lKd3Q3eDRqSWwrQ3RkVGVWT2ZvNjBKdEJwRHJFNUlFcmJybDZXVlpyNkdyS1RDaGtBS1ZpdkduazlFbU94T1FzZ0RNalVvbVlBTVNaT2RneVJqSjBlVTBjTXVlVFZ2bmpua3dHOTd1UXVzTUd6SWlpNlBYTWFRc3k3dER2M1diSmxGcktuSjZoTkh4UUZzQW1LU2FycTVRMmNiQXY3eWVsM2ZTYTJVa1J5SFYrWTYvYUhtbUQwMWloNXc1MTlUbGwreHNZWXRXSmZZNkIzQ1ZuYlc0NkoxeXIvZUwyRnUyMWREdjExOTR1d0R3cXI0SkdPOHJWSXJWa3pCODQ0VGNNTU5vZy9oY0Z1WnNNYXRjdU1CRElXd1JEcWlOT0tPRkxiMnFpR1RNeDhocjY0RDlTUWl4ekwrMU9hMHptZm12NmFtaXFJNVplbUoyVmFzSTlhUEpYYlpWQnB2UlRhYk1lVUNHMVJHUGM4ckxHV2I2RXZQWG5uUWZ2anFMZnAyZEVzdnhGSE5rbmgwbUhzYWpVc3hZOGhHT0EwaWQ4Smt6N0Zqcm01Q2dpTHlvZVdISEE1T0huUmxKdUl3QnQ3Y3V4TWhTU05aNnkzZ1EzZXNqRXRBajNnelFHWk5IV0F3L2JiWFZlaFV5bFhkQTFQdmFickxaUTVLNnI5bDZPSlorN1NBK0d0ZitwQWhPOUQ4Z0dCRGcxMmVBdTNEbzBYd1lWakVHZU5uSVp1NXJteVVnMDZXcWVrWlkyWGhwTnpzYm51TDNOY3VWUTlNMGZvWERYRm1jR0s0WFM4c2N4YkdkNlBQSjVjU1Y5d2cxb3ZxN1FmUjA2cEsrRzR1ZkgvckhFRnFsTzN6eE5lMVJRM3RKRFZhODJBdHI0T04raGhRQUpqZEpzMHJCaUJsV3c4ay9udHc1Q2orZnlmL1VWVUNia1NhbE1NZWs0bFVqY3FPRWx3ZnBWSno3OGNJMCtKRFFpQm5xWmdVV3FydEZyeGFSbmFWWFZXZlRTTUtHUE1udHJ0S0hRQ3FoMlB2N0tFd1M2ZDZUdlRIYjZGbnFEdnVFblhqMjZFOWxwZlNkMFJGQWdBS24wQmF2akxESGM4cE5Ob0FId0EycG5lTG5scXBtOEhScDBZaVhJckMrZzh3YWVuZWZoVFBHc2VaNGtjQjU1QlRzTk8xa3lqZG52Z3BpVTRTaVV3VzVSVzhXREdkRkJ3ZWtpcjlRVm1LOEJWdVF6WklvdjVlVWpkLzJUN3N2amdjdU1IR2l4RGRkWmRZSHBHY0VhSnpHTDA2ZlIwQUdqV0ZJVEsyalhuYUxrTVN4ZGpXZVY5aE94R1RDK1FyaXpDaWFVUndXaXhpSWEyM1VFS3JSSEx0ZE5DN2owTXBvb3ltUm15NVRHVHk4Ump6emZkWW9HZDNyV1JqZmFBPT07MDQwMFI1bExDOVVSb0Y2NW1ad3ZUZmpGZThhOHVZOVJpeGlGODhJVmxnaXlIVlN2N1hIdlFrOHdjWlJ2RkNNU2JsNXhpK2ovRXNCNjdBb3FhdVAza0NBTU9JMUt0R1llYUQxZWNkYTRVQWI3WFlNU01rTFpXNzhSbjlEQk4zbWk0S1NOTUxKZkl6aTdmV0pLNmtEeGpQRGZRdnNZT0ErVkNlM0E3MUVteWZpN2M5MGQvdFpTMktoMlJKSWEyYmR1TkIycTRWL3ZxWnUxODRGVVlhcDlaZ0duQVcvanVZMzZhVmR2K3dKenVEdlVjd1VkOGNnVUJ6dmJ5V1Zua1NnR01WWUo2U2JQZzFxdVZpUTBKNEZ3ZXRsVFFGaTlzNGxxNGZwVlViL1hwek9VN2wxaVp3Wm80WHN4eUE0akFlMDlHWXFySnV3Zks4ZVlrQVJPMFFYMnhxaFVETFltL1VjV3dzMG1pVUQrMGhPSkpYSGVHOXNFQTMzUEpjTXQycXJER1hhNnZQYUcrdm01aWtSeXNmR2I0T3dzVk9WOUZMWktBUnUvaEIxa1dYeVdMTXpwMzhnYi9NVzZqVXkvUjhOVEI5aEloeTFjU0REcVoyMjBJNFFFVDZHTTkrbVlvYjdhSnJwMTh3ZHhnQ1FmTks3cXN4aStsNVlNaUQzSzNYMHlhNWlyS05Pdjh3UjdmU1E1KzZ0T1puUHVHNHU2Y1FnK1pBZmY1UytFaXVLendhRktaSkxja2NzenluQUd5SWNQb0JsZTlZaDhvYmxaV3NaN0hWTXNCSEp0U3ZoZmZsVFI1WE05bGNBQmhIZHgrQy9lZGtRRkR5c0FzeTBBSDJXZ080MG9zQng2dzF0eDBtTVp6N0h0bVNRckt1SHQzOWJ2eEU4NmVWYVlKRUYwME0yZG13cEZKTWY0ZzROY1VLT3VoVnZMditENkUxN29hL1JWUERZTGloRGFucnlHMWpKSDdVb2lKODZyVzhiWUk1L3R1eDhWak1Cb1VxaDFmSlFyRlNCVzFuNzR0cGNPcTRnTmZ5Snc1WTlsekxoZWpvbEg2ank0MkhZRjVveVpISmUzVXhGMXNRNFhhTFlFdmR6SFhzZ0Urc25QOStTV2h3eHBIZ3VVaHdoeXp5RWlvcXVNcjZCM2xlRkZnM1Nud3Zqa1RFbVd3UVBKWjVuQ0dQR0toMjFpc0MyT0RNY3dZQ1F0TXVRUTNndnNSOGp3anM1Q2EyL3dCZGhpbTl2Sy9Vc1E1WE9ZbTBPcUtiQXRqZ3pITUdBa0xUTGtFTjRMN0VmSThJN09RbXR2OEFYWVlwdmJ5djFMRU9Wem1KdERxaW13TFk0TXh6QmdKS2FTQVdudTFJajA2eUZvZGcvdzZycHQwcVJuczdZUDl1NkhPWWRXRzdFb1pxZUllQ0hiREoyN21JWkdaS0VLaDd4VU4wc1lGOHIwOGY4dUNjQzB4T0RySTJqL3oyMjQzVVRqYkt6WnBVTkJkQ3FIbHdMK3dQVHJmc1ZUaXpCQWxOZWJSY0cyK1RaRmJhelI4N2ZlWGo0RjdQcUVFSE90TGE2eHJhT09IUldmNU5BZVBMc2ZsZUVzY0ljQVpqY25TT2t1cFd0SlhPd2pVc0hvemwrWFlTZ3dRQ2dTSzBTMjBWU2pVTkdSUzA4WWNWTWpxUEl5blN5Uk8rV29GMExYWStaalZla01ZRzNKWVh5RkhCYnNteXl6YjB2U3dXUkErYUI1VFNjeFJtWHNTeUFWOTVOVG9YYndIOHkxeldTcGtJMXpubnRjbWc4WDRSWHhCbVh5NlZYWVhvM0JUQ1gyaG9DZngwQUJWeGVmVWlLUTVWcURpZXRUb042cExxMUJjcTNiRmRNWFZJR0tBUXRHZ1k0NGNTVTdBNWU3cW9nSXJDZDZnZzZ3ZGxUU29kamNublQ0Q0oxY2luWUc2WHpWdDNXVkNGNjZDTXloSHR1TXM4VmJIWVBZcnJWRXpld2lmUmlJOTdXVHh6aVdVOXM1UWxMK1Q4ZTF5V3hQcDhEL1VmTnJ6NjM4ZVVOSGN3VmY0L0lVck1GTHhUcHpwKytxYVpPU3JzZUxJb0RWY1lQeG1qRHZYa3BjNUFUSm0xOGhvY1FqUU55eWFUZnVIcTB4ZGpLWTZOc3VwdzJMb1dyaEtPWndCajNtUDhiNEU1MkZpR0g4RjF6SzA3Um9jNllDeDF0c0h3M1pNWHhNOGc4WjkyL3BIb0FNUjBRcWd3Z0ZNT2pHQXN0bktyaGZIc2dvOXJOMU9WVzd3WHpTUFVGTlI2SlM5TGg0cjJFOHBLck1oN0tKdDV0YUNHcEhqWUxuNFFiZnFhQktRYitRWWhSd2NNYTVJbytpOXg4emQ1d3hINjM5VXJhZDR0SmsxcGYyNU1lVTlmMWtqRmEzRzdVRlhmTS9IQmVGY2tYa0lHVU8xYVNvMXlqOGpyUWo1SWxKY1FjcWpGZEdJNzJYaG15UU8yZmtTTklBd24rSE5Wd1pYSVBzWU0zOUp0RUp0UTBkN2dLRnM1dENYZ0trQUZmRWhtTStIakVMbGdCSmptYmtqejRPMWxpR3FHQlhqVDJ6Yk5CMlRTMUppbmNIOVNDcktJRlczcWxMVU5IYS9YbmhFMEdhTUhHUHJORW15Zi9VVlVDYmtTYWxNTWVrNGxVamN0ZWQrdHJtNGVjUGpaOUVUMDh3UDVDb3FVQWlnN2xvT2I5S0hWQ1hYdndrdmwyRHBTYXRsNFZOU3RWRURwK09zZ1A4L0VJdXl0UUczSnJlK1diL2pQY0Vic1ZBdE5wU0g2Z0p1WXlQY1JjVHRHYWwyUVpKa0YvdzMvMFRSTlI4ckkrdkpVVjdVL3JMR1NSbFlubldSdTBseThTRTByRzJ4aW5OdkptdHUzbmpFNG9RajVLTXZKc216VUhiOEgweC8vYkkxZldlVWN0WDRFNU9tbkY3anVYd1Y0VElGbVI4MnhqZHZyNWwwc0hKWTZTM2VPSXg1N2E2Ni9hQ3psZjU4aG5neHg1N1AxQkNsZU9OWG11dm1iNHdVNytwS1c4U00wdk03RVZUWEtIczM3MkRnZ3JNU0dCNVVZOUFDMHBsOEdrK0k2dnRWQWQwckNkT29VRnViZjlDU09QOEYvZXlBSVp2ZjM2V3VwVU9YZmQ4UDhJUmNyMFhtcE1OTTVQc2FBaWtIZU9KL1habU1NZHJYTWVaUmtWaTBGUnVscnVYUVFxS1l2Slh6aXN3TERFcmFhOE94WWV0Qy9XaWpUSGdhUXNyRGZVRWRocWhmQUF0dzdTSWJtSzkrUG44NTk3Q2NweVcxVXpxYytYYjNjb0FyY2Q4ZCs1N3hzb092Z3cvUlAxMU9vYzcwL3pIT1FuNitXQ1RSMC9FTjVxbXpOQ2Q4VDc5MkJxWWVXQk1vNVRqTVdTUXh4TnhpaEEwTVRQN0tlRFBNTkhXN1Z2RzZYRUFSdWMxR1FzZXVnYTVlTlBnMkRHelEySEpGT2w3TCtpdVEwdUlUbjU1dWg3L2M4TGhQRWVLb092OE9jZzFaTDNaUFlET0Q0VlYzb04wR2xKUGZUS1hrNVhGS3BmS0YreE1DSDJKOVUrOWxrbkRGam5WWU1BRitSblJKNG5XSFh6a29sc1NhZUtZakQ5Y2cyUHFRczhkUG5zUnBjaDJ0TXovWjQyUEZDSDFWNEZPbFZRZEJJenlWampQbE1QM2FWT3VRc01ZVzZiSVZHS2lKbUFrMTR0NEkyTjBtNHpwK29lS2tvalJrd0Y1VkphTGtENWVsM0hrTEprcTAzVjh3dEVXZHh2NlhqUVFEZEpraVltQzROQmcvbWl2bnpTNFhJYW5JOUh5ZHVteVM5RnNkdEF1d1I4cUljVFpNM2RzTTVGQmZTUkdnYlE9Iiwic3RhdHVzIjoiQ09NUExFVEUifV0sImRpYWdub3N0aWNzIjp7InRpbWVUb1Byb2R1Y2VQYXlsb2FkIjoxMDI4LCJlcnJvcnMiOlsiQzExMDQiLCJDMTAwMCIsIkMxMDA0Il0sImRlcGVuZGVuY2llcyI6W3sidGltZVRvUHJvZHVjZVBheWxvYWQiOjExMzIxNjMsImVycm9ycyI6W10sIm5hbWUiOiJpb3ZhdGlvbm5hbWUifV19LCJleGVjdXRpb25Db250ZXh0Ijp7InJlcG9ydGluZ1NlZ21lbnQiOiIyNyx3d3cuZXhwZWRpYS5jby5pbixFeHBlZGlhLFVMWCIsInJlcXVlc3RVUkwiOiJodHRwczovL3d3dy5leHBlZGlhLmNvLmluL2FkZHBhc3N3b3JkP3JlZGlyZWN0VG89JTJGJnRva2VuPWI5NDNlOWMwLWE3OTMtNGFkZS1hNTRhLTc1N2EwY2MwZjQ2MCZzY2VuYXJpbz1TSUdOVVAmdmFyaWFudD1QQVNTV09SRF8zIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwicGxhY2VtZW50IjoiTE9HSU4iLCJwbGFjZW1lbnRQYWdlIjoiMjciLCJzY3JpcHRJZCI6IjY4YTAwYzAzLWUwNjUtNDdkMy1iMDk4LWRkODYzOGI0YjM5ZSIsInZlcnNpb24iOiIxLjAiLCJ0cnVzdFdpZGdldFNjcmlwdExvYWRVcmwiOiJodHRwczovL3d3dy5leHBlZGlhLmNvbS90cnVzdFByb3h5L3R3LnByb2QudWwubWluLmpzIn0sInNpdGVJbmZvIjp7fSwic3RhdHVzIjoiQ09NUExFVEUiLCJwYXlsb2FkU2NoZW1hVmVyc2lvbiI6MX0=',
                        type: 'TRUST_WIDGET',
                    },
                ],
            },
            channelType: 'WEB',
            password: userDetails.password,
            cmsToken: cmsToken,
            accountConsent: true,
            emailOptIn: true,
            scenario: 'SIGNUP',
        });
        const headers = {
            accept: 'application/json',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            brand: 'expedia',
            'Content-Type': 'application/json',
            cookie: cookies,
            'Device-Type': 'DESKTOP',
            'Device-User-Agent-Id': userAgentId,
            eapid: '0',
            Origin: 'https://www.expedia.co.in',
            pointOfSaleId: '',
            priority: 'u=1, i',
            referer: `https://www.expedia.co.in/addpassword?redirectTo=%2F&scenario=SIGNUP&variant=PASSWORD_3&token=${cmsToken}`,
            'sec-ch-ua': browserIdentifier,
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            siteId: '27',
            tpid: '27',
            'Trace-Id': traceId,
            'User-Agent': userAgent,
            'X-REMOTE-ADDR': 'undefined',
            'X-USER-AGENT': 'undefined',
            'X-XSS-Protection': '1; mode=block',
        };
        let config = {
            method: 'POST',
            url: url,
            headers: headers,
            data: data,
        };

        const response = await axiosRequest({ config });
        return response;
    } catch (error) {
        console.log(`🚀 ~ setpasswordotp ~ error:`, error, JSON.stringify(error.response.data));
        throw new Error(error);
    }
};

//register page render.
const registerPage = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(`🚀 ~ pageRender ~ error:`, error);
        return { message: error.message, status: error.status };
    }
};

const registerProcess = async (req, res) => {
    try {
        const userDetails = req.body;
        res.cookie('userdetails', JSON.stringify(req.body));
        globalUserDetails = userDetails;

        const initialPage = await initialPageRender();
        //send otp function call to send otp on email
        const sendEmailResponse = await sendOtpOnEmail({
            userDetails,
            csrfToken: initialPage.loginCsrfToken,
            DUAIdToken: initialPage.DUAIdToken,
            cookies: initialPage.initialPageCookies,
            userAgentId: initialPage.userAgentId,
            xb3TraceId: initialPage.xb3TraceId,
        });

        if (sendEmailResponse.status !== 200)
            return res.status(400).json({ message: 'Something went wrong please try again' });
        const sendOtpResponseCookie = sendEmailResponse.headers['set-cookie'].map((el) => el.split('; ')[0]).join('; ');

        console.log(`🚀 ~ registerProcess ~ sendOtpResponseCookie:`, sendOtpResponseCookie);

        console.log(
            `🚀 ~ registerProcess ~ {
            userDetails,
            DUAIdToken: initialPage.DUAIdToken,
            cookies: initialPage.initialPageCookies,
            ctxViewId: initialPage.ctxViewId,
            clientInfo: initialPage.clientInfo,
        }:`,
            {
                userDetails,
                DUAIdToken: initialPage.DUAIdToken,
                // cookies: `${sendOtpResponseCookie}; ${initialPage.initialPageCookies}`,
                cookies: initialPage.initialPageCookies,
                ctxViewId: initialPage.ctxViewId,
                clientInfo: initialPage.clientInfo,
            }
        );
        //IdentityAuthenticateByOtpFormQuery call function get response
        const otpAuthenticateResponse = await identityAuthenticateByOtp({
            userDetails,
            DUAIdToken: initialPage.DUAIdToken,
            // cookies: `${sendOtpResponseCookie}; ${initialPage.initialPageCookies}`,
            cookies: initialPage.initialPageCookies,
            ctxViewId: initialPage.ctxViewId,
            clientInfo: initialPage.clientInfo,
        });

        const heading = otpAuthenticateResponse.data[0].data.identityAuthenticateByOTPForm.heading;
        if (heading === "Let's confirm your email") {
            return res.render('otpVerify');
        } else {
            return res.json(otpAuthenticateResponse);
        }
    } catch (error) {
        console.log(`🚀 ~ registerProcess ~ error:`, error);

        return res.json({ message: 'Something went worng.' });
    }
};

const otpVerifyProcess = async (req, res) => {
    try {
        const otpDetails = req.body;
        const fcToken = await createFCToken();

        const otpVerifyResponse = await otpVerify({
            DUAIdToken: globalDUAIdToken,
            userDetails: globalUserDetails,
            csrfToken: globalverifyOtpCSRFToken,
            fcToken: fcToken,
            otpDetails,
            clientInfo: globalClientInfo,
            cookies: globalCookiesForLogin,
            ctxViewId: globalCtxViewId,
        });

        console.log(`🚀 ~ otpVerifyProcess ~ otpVerifyResponse:`, otpVerifyResponse);

        if (otpVerifyResponse.status !== 200) {
            return res.sataus(400).json('Something went worng please try again');
        }
        const accountmergemutaionResponse = await accountmeregmutaion({
            DUAIdToken: globalDUAIdToken,
            cmsToken: otpVerifyResponse.cmsToken,
            cookies: otpVerifyResponse.cookies,
            clientInfo: globalClientInfo,
        });

        const profileDeatilsPageResponse = await profileDeatilsPage({
            cmsToken: otpVerifyResponse.cmsToken,
            cookies: otpVerifyResponse.cookies,
        });

        //call set account details api.
        const setAccountDeatilsResponse = await setAccountDeatils({
            DUAIdToken: globalDUAIdToken,
            csrfToken: profileDeatilsPageResponse.csrfToken,
            cmsToken: otpVerifyResponse.cmsToken,
            userDetails: globalUserDetails,
            cookies: accountmergemutaionResponse.cookies,
        });

        const setPasswordCookies = setAccountDeatilsResponse.headers['set-cookie']
            .map((el) => el.split('; ')[0])
            .join('; ');

        const setPasswordPageResponse = await setPasswordPage({
            cmsToken: otpVerifyResponse.cmsToken,
            cookies: setPasswordCookies,
        });

        //set password api call
        const setpasswordotpResponse = await setpasswordotp({
            csrfToken: setPasswordPageResponse.setPasswordCsrfToken,
            userDetails: globalUserDetails,
            cmsToken: otpVerifyResponse.cmsToken,
            userAgentId: profileDeatilsPageResponse.userAgentId,
            traceId: setPasswordPageResponse.setPasswordTrcaeId,
            cookies: setPasswordCookies,
        });

        if (setpasswordotpResponse.status === 200) {
            return res.status(200).json({ message: 'Register successfully!' });
        }
    } catch (error) {
        console.log(`🚀 ~ otpVerifyProcess ~ error:`, error);
        return res.json({ message: 'Something went worng.' });
    }
};

const login = async (req, res) => {
    try {
        // const initialPage = await initialPageRender();

        return res.sataus(200).json({ message: 'Try after some time!' });
    } catch (error) {
        console.log(`🚀 ~ login ~ error:`, error);
        return res.json({ message: 'Something went worng.' });
    }
};
module.exports = {
    registerPage,
    registerProcess,
    otpVerifyProcess,
    login,
};
