import { settingsApi } from '@/src/api/settings';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { FileQuestionMark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export const DashboardPage = () => {
	const [ apiKey, setApiKey ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ isEnableChatBot, setIsEnableChatBot ] = useState( false );

	useEffect( () => {
		settingsApi.get().then( ( res ) => {
			console.log( res );
			setApiKey( res.data.apiKey );
			setIsEnableChatBot( res.data.isEnableChatBot );
		} );
	}, [] );

	const handleSaveSettings = async () => {
		setLoading( true );
		try {
			await settingsApi.update( {
				apiKey,
				isEnableChatBot,
			} );
		} catch ( error ) {
			console.log( error );
		} finally {
			setLoading( false );
		}
	};

	return (
		<>
			<Toaster richColors />
			<Card>
				<h3 className="bg-gradient-to-r !m-0 !text-2xl from-blue-500 to-indigo-500 px-4 py-2 rounded bg-clip-text !text-transparent">
					Omnipress AI Chatbot
				</h3>

				<CardContent className="space-y-8">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Label htmlFor="apiKey">API Key</Label>
							<Tooltip>
								<TooltipTrigger
									asChild
									className="cursor-pointer"
								>
									<FileQuestionMark className="w-4 h-4" />
								</TooltipTrigger>
								<TooltipContent
									align="start"
									className="max-w-[300px] bg-white border border-gray-200"
								>
									<p className="!text-gray-500">
										Enter your Omnipress api Key. You can
										get it from{ ' ' }
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
							id="apiKey"
							placeholder="Enter your API key"
							value={ apiKey }
							onChange={ ( e ) => setApiKey( e.target.value ) }
						/>
					</div>

					<div className="space-y-2 flex gap-4 items-center">
						<Switch
							id="isEnableChatBot"
							checked={ isEnableChatBot }
							onCheckedChange={ setIsEnableChatBot }
						/>
						<Label className="mb-2" htmlFor="isEnableChatBot">
							Enable Chatbot
						</Label>
						<Switch />
						<Tooltip>
							<TooltipTrigger
								asChild
								className="cursor-pointer mb-2"
							>
								<FileQuestionMark className="w-4 h-4" />
							</TooltipTrigger>
							<TooltipContent
								align="start"
								className="max-w-[300px] bg-white border border-gray-200 mb-2"
							>
								<p className="!text-gray-500 mb-2">
									When Enable this option, the chatbot will be
									visible on your website.
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</CardContent>

				<CardFooter>
					<Button onClick={ handleSaveSettings } disabled={ loading }>
						Save
					</Button>
				</CardFooter>
			</Card>
		</>
	);
};
