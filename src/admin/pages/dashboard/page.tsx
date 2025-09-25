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
import { FileQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

// primary-gradient, icon position
const tabs = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "Customizations",
    value: "customizations",
  },
  {
    label: "Client",
    value: "client",
  },
];

interface ChatbotSettings {
  apiKey: string;
  isEnableChatBot: boolean;
  customizations: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    iconPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
  client: {
    name: string;
    email: string;
    slug: string;
  };
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
              </TabsContent>

              <TabsContent className="p-4 space-y-3" value="customizations">
                <h3 className="text-xl font-bold !text-foreground">
                  Customizations
                </h3>

                {loading ? (
                  <div className="flex items-center space-x-4 p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="gradient">Primary gradient</Label>
                      <Input
                        id="gradient"
                        value={chatbotSettings?.customizations?.backgroundColor}
                        onChange={(e) =>
                          onChangeHandler("customizations.backgroundColor")(
                            e.target.value
                          )
                        }
                        className="max-w-1/2 min-h-8"
                        placeholder="Enter your primary theme color"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="gradient">Text Color</Label>
                      <Input
                        id="gradient"
                        value={chatbotSettings?.customizations?.textColor}
                        onChange={(e) =>
                          onChangeHandler("customizations.textColor")(
                            e.target.value
                          )
                        }
                        className="max-w-1/2 min-h-8"
                        placeholder="Enter your primary theme color"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="gradient">Link Color</Label>
                      <Input
                        id="gradient"
                        value={chatbotSettings?.customizations?.linkColor}
                        onChange={(e) =>
                          onChangeHandler("customizations.linkColor")(
                            e.target.value
                          )
                        }
                        className="max-w-1/2 min-h-8"
                        placeholder="Enter your primary theme color"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="gradient">Icon Position</Label>
                      <select
                        value={chatbotSettings?.customizations?.iconPosition}
                        onChange={(e) =>
                          onChangeHandler("customizations.iconPosition")(
                            e.target.value
                          )
                        }
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent className="p-4 space-y-3" value="client">
                <h3 className="text-xl font-bold !text-foreground">
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
                  <Label htmlFor="clientSlug">Client Slug</Label>
                  <Input
                    id="clientSlug"
                    placeholder="Enter client slug"
                    value={chatbotSettings?.client?.slug}
                    onChange={(e) =>
                      onChangeHandler("client.slug")(e.target.value)
                    }
                  />
                </div>
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
