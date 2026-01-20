---
title: "System Architecture: Event-Driven Design"
description: "A deep dive into how I use Kafka and Redis."
pubDate: 2023-10-27
tags: ["system-design", "backend"]
mermaid: true 
---

## The Core Concept

When designing for high throughput, we decouple the write path from the read path.

### The Code
Here is a sample Python consumer using `asyncio`:

```python
async def consume():
    consumer = AIOKafkaConsumer(
        'my_topic',
        loop=loop, 
        bootstrap_servers='localhost:9092'
    )
    # Start the consumer
    await consumer.start()