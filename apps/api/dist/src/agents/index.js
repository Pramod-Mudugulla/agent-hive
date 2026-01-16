import { streamText, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supportTools, ordersTools, billingTools } from './tools';
export async function routeQuery(query, history) {
    const { text: intent } = await generateText({
        model: openai('gpt-4o'),
        system: `You are a router agent for a customer support system. 
    Classify the user intent into one of these categories: 
    - SUPPORT (general info, FAQs, troubleshooting)
    - ORDERS (order status, tracking, cancellations)
    - BILLING (payments, refunds, invoices)
    - UNKNOWN (if you can't classify)
    Return only the category name.`,
        prompt: query,
    });
    console.log(`Classified intent: ${intent}`);
    let agentTools = {};
    let systemPrompt = '';
    switch (intent.trim().toUpperCase()) {
        case 'SUPPORT':
            agentTools = supportTools;
            systemPrompt = 'You are a helpful Support Agent. Use the query_knowledge_base or search_faqs tools to help the user.';
            break;
        case 'ORDERS':
            agentTools = ordersTools;
            systemPrompt = 'You are a helpful Orders Agent. Use tools to check order status, track delivery or update orders.';
            break;
        case 'BILLING':
            agentTools = billingTools;
            systemPrompt = 'You are a helpful Billing Agent. Use tools to check invoices or refund status.';
            break;
        default:
            systemPrompt = 'You are a helpful customer support agent. Help the user as best as you can or ask for more details to route them to the right department.';
            break;
    }
    return streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages: [
            ...history,
            { role: 'user', content: query }
        ],
        tools: agentTools,
        maxSteps: 5, // Allow for tool calling loops
    });
}
