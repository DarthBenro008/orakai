"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavMenu } from "@/components/nav-menu"
import {
    ArrowRight,
    ExternalLink,
    ChevronRight,
    Layers,
    Shuffle,
    Bot,
    Shield,
    Blocks,
    DollarSign,
    BarChart3,
    Gamepad2,
    Vote,
    Palette,
    Wand2,
    TrendingUp,
    Database,
    Server,
    Network,
    Workflow,
} from "lucide-react"
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function OrakaiLanding() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavMenu />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center">
                        <h1 className="font-jetbrains-mono text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            Orakai — The Decentralized AI Oracle for Web3
                        </h1>
                        <p className="text-xl md:text-2xl font-medium mb-6 text-muted-foreground">Ask. Verify. Trust.</p>
                        <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-10">
                            Orakai bridges the gap between smart contracts and artificial intelligence by enabling trustless,
                            verifiable, and secure AI data streams onchain.
                            <br />
                            Powered by Filecoin, OpenRouter.ai, Storacha, Randamu, and the
                            Checker Subnet.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => router.push("/login")} size="lg">
                                Create your AI powered data stream <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Link href={"https://staging-assets.kofferx.com/orakai_whitepaper.pdf"} target="_blank">
                                <Button size="lg" variant="outline">
                                    Read the Docs <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-8">
                            Bridging Web3 and AI, the Right Way
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="bg-card p-8 rounded-lg shadow-sm">
                                <h3 className="font-jetbrains-mono text-xl font-semibold mb-6 text-destructive">The Problem</h3>
                                <ul className="space-y-4 text-left">
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 text-destructive">•</div>
                                        <p>Smart contracts can't call external AI models directly</p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 text-destructive">•</div>
                                        <p>Existing oracles aren't built with LLMs in mind</p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 text-destructive">•</div>
                                        <p>Centralized AI integrations break trust assumptions</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-card p-8 rounded-lg shadow-sm">
                                <h3 className="font-jetbrains-mono text-xl font-semibold mb-6 text-primary">The Solution</h3>
                                <p className="text-muted-foreground">
                                    Orakai is a decentralized, modular oracle designed specifically for AI workloads. It ensures trustless
                                    data pipelines using verifiable randomness, decentralized storage, and onchain governance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-4">Why Builders Choose Orakai</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Bot className="h-8 w-8 text-primary" />,
                                title: "First-Class AI Oracle",
                                description: "Built ground-up to integrate LLMs in a trustless fashion",
                            },
                            {
                                icon: <Layers className="h-8 w-8 text-primary" />,
                                title: "Modular Architecture",
                                description: "Mix-and-match components, upgrade without redeploying",
                            },
                            {
                                icon: <Shuffle className="h-8 w-8 text-primary" />,
                                title: "Cross-Chain Compatible",
                                description: "EVM support with standardized APIs",
                            },
                            {
                                icon: <Workflow className="h-8 w-8 text-primary" />,
                                title: "Agentic Economy",
                                description: "Let AI agents compete, cooperate, and evolve",
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-primary" />,
                                title: "Verifiable & Secure",
                                description: "Onchain randomness + decentralized governance",
                            },
                            {
                                icon: <Blocks className="h-8 w-8 text-primary" />,
                                title: "Composable",
                                description: "Drop-in integration for any EVM smart contract",
                            },
                            {
                                icon: <DollarSign className="h-8 w-8 text-primary" />,
                                title: "Cost-Efficient",
                                description: "Optimized for gas + flexible worker roles",
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="border shadow-sm">
                                <CardHeader>
                                    <div className="mb-2">{feature.icon}</div>
                                    <CardTitle className="font-jetbrains-mono text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-4">
                            Powering the Next Wave of Web3 Apps
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">Real AI use-cases, onchain and verifiable.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                                title: "DeFi",
                                description: "Market sentiment and AI risk scoring",
                            },
                            {
                                icon: <Gamepad2 className="h-6 w-6 text-primary" />,
                                title: "Gaming",
                                description: "Fair randomness and dynamic world-building",
                            },
                            {
                                icon: <Vote className="h-6 w-6 text-primary" />,
                                title: "Governance",
                                description: "AI-assisted voting decisions",
                            },
                            {
                                icon: <Palette className="h-6 w-6 text-primary" />,
                                title: "NFTs",
                                description: "AI-generated metadata and content",
                            },
                            {
                                icon: <Wand2 className="h-6 w-6 text-primary" />,
                                title: "Autonomous Agents",
                                description: "Onchain AIs making decisions",
                            },
                            {
                                icon: <TrendingUp className="h-6 w-6 text-primary" />,
                                title: "Prediction Markets",
                                description: "AI-based trend forecasting",
                            },
                        ].map((useCase, index) => (
                            <Card key={index} className="border shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-3">
                                    {useCase.icon}
                                    <CardTitle className="font-jetbrains-mono text-lg">{useCase.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{useCase.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture Overview */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-8">Composable, Verifiable, Modular</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {[
                            {
                                icon: <Database className="h-10 w-10 text-primary" />,
                                title: "Smart Contract Layer",
                                description: "EVM-compatible, Randamu-powered, with secure callbacks",
                            },
                            {
                                icon: <Network className="h-10 w-10 text-primary" />,
                                title: "Aggregator Network",
                                description: "Validates responses and establishes quorum",
                            },
                            {
                                icon: <Bot className="h-10 w-10 text-primary" />,
                                title: "Worker Network",
                                description: "LLMs via OpenRouter + decentralized storage with Storacha",
                            },
                            {
                                icon: <Shield className="h-10 w-10 text-primary" />,
                                title: "Checker Subnet",
                                description: "Governance, verification, and reputation scoring",
                            },
                            {
                                icon: <Server className="h-10 w-10 text-primary" />,
                                title: "Backend Services",
                                description: "Metadata, user/project tracking, and query flow management",
                            },
                        ].map((layer, index) => (
                            <div
                                key={index}
                                className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center text-center"
                            >
                                {layer.icon}
                                <h3 className="font-jetbrains-mono text-lg font-semibold my-3">{layer.title}</h3>
                                <p className="text-sm text-muted-foreground">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-8">
                            Built with the Best of Decentralized Infra
                        </h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            "OpenRouter.ai",
                            "Storacha",
                            "Randamu",
                            "Checker Subnet",
                            "EVM / Solidity",
                            "IPFS",
                            "zkML (Coming Soon)",
                        ].map((tech, index) => (
                            <div
                                key={index}
                                className="bg-card px-6 py-3 rounded-full border shadow-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-300"
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Future Vision / Growth */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-8">What's Next for Orakai?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            "DAO-run Multi-Aggregator Support",
                            "zkML Inference Verification",
                            "Native Token with Staking & Payments",
                            "Query NFTs for decentralized data ownership",
                            "Advanced LLM Model Marketplace",
                            "Support for non-EVM chains",
                        ].map((item, index) => (
                            <div key={index} className="bg-card p-6 rounded-lg border shadow-sm flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                    <ChevronRight className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-muted-foreground">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-jetbrains-mono text-3xl md:text-4xl font-bold mb-4">
                        Ready to Make Smart Contracts Smarter?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Start building with AI + decentralization, the trustless way.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg">
                            Deploy Your First Query <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Join the Community <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-muted-foreground">© 2025 Orakai. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Twitter
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Discord
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            GitHub
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            Documentation
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
