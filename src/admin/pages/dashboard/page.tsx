import { settingsApi } from "@/src/api/settings";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { FileQuestionMark, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

// primary-gradient, icon position
const tabs = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "Client",
    value: "client",
  },
  {
    label: "Example Questions",
    value: "example_questions",
  },
];

interface ChatbotSettings {
  apiKey?: string;
  isEnableChatBot?: boolean;
  isEnableLeadCapture?: boolean;
  customizations?: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    logoUrl: string;
    titleText: string;
    iconPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
  client?: {
    name: string;
    email: string;
    collection_name: string;
  };
  exampleQuestions?: string[];
}

export const DashboardPage = () => {
  const [loading, setLoading] = useState(false);

  const [chatbotSettings, setChatbotSettings] =
    useState<ChatbotSettings | null>(null);

  useEffect(() => {
    setLoading(true);
    settingsApi
      .get()
      .then((res) => {
        setChatbotSettings(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await settingsApi.update(chatbotSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function setNestedValueRecursive(obj, path, value) {
    const [first, ...rest] = path.split(".");
    if (rest.length === 0) {
      obj[first] = value;
      return;
    }

    if (!obj[first] || typeof obj[first] !== "object") {
      obj[first] = {};
    }

    setNestedValueRecursive(obj[first], rest.join("."), value);
  }

  const onChangeHandler =
    (key: string) => (value: string | boolean | undefined) => {
      if (key.includes(".")) {
        let obj = { ...chatbotSettings };
        setNestedValueRecursive(obj, key, value);
        setChatbotSettings(obj);
      } else {
        setChatbotSettings((prev) => ({
          ...(prev || {}),
          [key]: value,
        }));
      }
    };

  return (
    <>
      <Toaster richColors />
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold !text-foreground">
            Chatbot Settings
          </h3>
        </CardHeader>
        <CardContent className="space-y-8">
          {loading ? (
            <div className="flex items-center space-x-4 p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="general">
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent className="p-4 space-y-3" value="general">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Tooltip>
                      <TooltipTrigger asChild className="cursor-pointer">
                        <FileQuestionMark className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        className="max-w-[300px] bg-white border border-gray-200"
                      >
                        <p className="!text-gray-500">
                          Enter your Omnipress api Key. You can get it from
                          <a
                            className="text-blue-500 hover:underline"
                            href="https://omnipressai.com"
                            target="_blank"
                          >
                            Omnipress
                          </a>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="password"
                    id="apiKey"
                    placeholder="Enter your API key"
                    value={chatbotSettings?.apiKey}
                    onChange={(e) => onChangeHandler("apiKey")(e.target.value)}
                  />
                </div>

                <div className="space-y-2 flex gap-4 items-center mt-3">
                  <Switch
                    id="isEnableChatBot"
                    checked={chatbotSettings?.isEnableChatBot}
                    onCheckedChange={onChangeHandler("isEnableChatBot")}
                  />
                  <Label className="mb-2" htmlFor="isEnableChatBot">
                    Enable Chatbot
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild className="cursor-pointer mb-2">
                      <FileQuestionMark className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      className="max-w-[300px] bg-white border border-gray-200 mb-2"
                    >
                      <p className="!text-gray-500 mb-2">
                        When Enable this option, the chatbot will be visible on
                        your website.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg border mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isEnableLeadCapture">Enable Lead Capture</Label>
                    <p className="text-sm text-muted-foreground">
                      Ask user details for first time chat
                    </p>
                  </div>
                  <Switch
                    id="isEnableLeadCapture"
                    checked={chatbotSettings?.isEnableLeadCapture ?? false}
                    onCheckedChange={(val) =>
                      onChangeHandler("isEnableLeadCapture")(val)
                    }
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="titleText">Bot Title Text</Label>
                  <Input
                    id="titleText"
                    value={chatbotSettings?.customizations?.titleText}
                    onChange={(e) =>
                      onChangeHandler("customizations.titleText")(
                        e.target.value
                      )
                    }
                    placeholder="e.g. AI Assistant"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label>Bot Icon / Logo</Label>
                  <div className="flex items-center gap-4">
                    {chatbotSettings?.customizations?.logoUrl && (
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                        <img
                          src={chatbotSettings.customizations.logoUrl}
                          alt="Bot Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const frame = (window as any).wp.media({
                          title: 'Select or Upload Bot Logo',
                          button: { text: 'Use this logo' },
                          multiple: false
                        });
                        frame.on('select', () => {
                          const attachment = frame.state().get('selection').first().toJSON();
                          onChangeHandler("customizations.logoUrl")(attachment.url);
                        });
                        frame.open();
                      }}
                    >
                      {chatbotSettings?.customizations?.logoUrl ? "Change Logo" : "Upload Logo"}
                    </Button>
                    {chatbotSettings?.customizations?.logoUrl && (
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => onChangeHandler("customizations.logoUrl")("")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent className="p-4 space-y-3" value="client">
                <h3 className="text-xl font-bold text-foreground!">
                  Client Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={chatbotSettings?.client?.name}
                    onChange={(e) =>
                      onChangeHandler("client.name")(e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    placeholder="Enter client email"
                    value={chatbotSettings?.client?.email}
                    onChange={(e) =>
                      onChangeHandler("client.email")(e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSlug">Collection Name</Label>
                  <Input
                    id="clientSlug"
                    placeholder="Enter collection name"
                    value={chatbotSettings?.client?.collection_name}
                    onChange={(e) =>
                      onChangeHandler("client.collection_name")(e.target.value)
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent className="p-4 space-y-4" value="example_questions">
                <h3 className="text-xl font-bold !text-foreground">
                  Example Questions
                </h3>
                <p className="text-sm text-gray-500">
                  These questions appear on the welcome screen of your chatbot
                  to help users get started quickly.
                </p>

                <div className="space-y-3">
                  {(chatbotSettings?.exampleQuestions ?? []).map((q, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Question ${index + 1}`}
                        value={q}
                        onChange={(e) => {
                          const updated = [
                            ...(chatbotSettings?.exampleQuestions ?? []),
                          ];
                          updated[index] = e.target.value;
                          setChatbotSettings((prev) =>
                            prev ? { ...prev, exampleQuestions: updated } : prev
                          );
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 shrink-0"
                        onClick={() => {
                          const updated = [
                            ...(chatbotSettings?.exampleQuestions ?? []),
                          ].filter((_, i) => i !== index);
                          setChatbotSettings((prev) =>
                            prev
                              ? { ...prev, exampleQuestions: updated }
                              : prev
                          );
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const updated = [
                      ...(chatbotSettings?.exampleQuestions ?? []),
                      "",
                    ];
                    setChatbotSettings((prev) =>
                      prev ? { ...prev, exampleQuestions: updated } : prev
                    );
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleSaveSettings} disabled={loading}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
