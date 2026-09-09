"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

interface Props {
	readonly value?: string;
	readonly onChange: (html: string) => void;
}

export default function EditorInstrucciones({ value = "", onChange }: Props) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
			}),
			Strike,
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph", "image"],
			}),
			Image.configure({
				inline: false,
				allowBase64: true,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-stone-900 underline underline-offset-2 cursor-pointer",
				},
			}),
			CodeBlock,
			HorizontalRule,
		],
		content: value,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "prose prose-stone max-w-none focus:outline-none min-h-[220px] p-3 text-xs font-serif bg-white text-stone-800",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return null;
	}

	const addImageByUrl = () => {
		const url = window.prompt("Ingresa la URL de la imagen:");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const addImageFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				if (result) {
					editor.chain().focus().setImage({ src: result }).run();
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const setLink = () => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL del enlace:", previousUrl);

		if (url === null) {
			return;
		}

		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	};

	// Estilo base neutral y minimalista para los botones
	const getButtonClass = (isActive: boolean) =>
		`px-2 py-0.5 rounded transition-colors cursor-pointer text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 ${
			isActive ? "bg-stone-200 text-stone-950 font-bold" : ""
		}`;

	return (
		<div className="border border-stone-200 bg-white rounded-md overflow-hidden focus-within:border-stone-400 transition-colors">
			<style jsx global>{`
				.ProseMirror ul {
					list-style-type: disc !important;
					padding-left: 1.5rem !important;
					margin: 0.5rem 0 !important;
				}
				.ProseMirror ol {
					list-style-type: decimal !important;
					padding-left: 1.5rem !important;
					margin: 0.5rem 0 !important;
				}
				.ProseMirror li {
					margin: 0.25rem 0 !important;
				}
				.ProseMirror h1 {
					font-size: 1.35rem !important;
					font-weight: bold !important;
					margin-top: 1rem !important;
					margin-bottom: 0.3rem !important;
				}
				.ProseMirror h2 {
					font-size: 1.15rem !important;
					font-weight: bold !important;
					margin-top: 0.75rem !important;
					margin-bottom: 0.25rem !important;
				}
				.ProseMirror h3 {
					font-size: 1rem !important;
					font-weight: bold !important;
					margin-top: 0.5rem !important;
					margin-bottom: 0.25rem !important;
				}
				.ProseMirror blockquote {
					border-left: 3px solid #78716c !important;
					padding-left: 0.75rem !important;
					font-style: italic !important;
					color: #57534e !important;
					margin: 0.5rem 0 !important;
				}
				.ProseMirror pre {
					background: #1c1917 !important;
					color: #f5f5f4 !important;
					font-family: monospace !important;
					padding: 0.75rem !important;
					border-radius: 0.375rem !important;
					margin: 0.75rem 0 !important;
				}
				.ProseMirror hr {
					border: none;
					border-top: 1px solid #e7e5e4;
					margin: 1.5rem 0;
				}
				.ProseMirror img {
					max-width: 100% !important;
					height: auto !important;
					border-radius: 0.375rem;
					margin: 0.75rem auto;
				}
			`}</style>

			{/* Barra de Herramientas Minimalista */}
			<div className="flex flex-wrap items-center gap-1 bg-stone-50 border-b border-stone-200 px-3 py-1.5 text-xs font-mono text-stone-600">
				{/* Títulos */}
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={getButtonClass(
						editor.isActive("heading", { level: 1 }),
					)}
				>
					H1
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={getButtonClass(
						editor.isActive("heading", { level: 2 }),
					)}
				>
					H2
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={getButtonClass(
						editor.isActive("heading", { level: 3 }),
					)}
				>
					H3
				</button>

				<span className="text-stone-300 self-center">|</span>

				{/* Formatos Básicos */}
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={getButtonClass(editor.isActive("bold"))}
				>
					Negrita
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={getButtonClass(editor.isActive("italic"))}
				>
					Cursiva
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleUnderline().run()
					}
					className={getButtonClass(editor.isActive("underline"))}
				>
					Subrayado
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={getButtonClass(editor.isActive("strike"))}
				>
					Tachado
				</button>

				<span className="text-stone-300 self-center">|</span>

				{/* Alineación */}
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
					className={getButtonClass(
						editor.isActive({ textAlign: "left" }),
					)}
				>
					Izquierda
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
					className={getButtonClass(
						editor.isActive({ textAlign: "center" }),
					)}
				>
					Centro
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
					className={getButtonClass(
						editor.isActive({ textAlign: "right" }),
					)}
				>
					Derecha
				</button>

				<span className="text-stone-300 self-center">|</span>

				{/* Estructura y Enlaces */}
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					className={getButtonClass(editor.isActive("bulletList"))}
				>
					Lista
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					className={getButtonClass(editor.isActive("orderedList"))}
				>
					Numérica
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					className={getButtonClass(editor.isActive("blockquote"))}
				>
					Cita
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleCodeBlock().run()
					}
					className={getButtonClass(editor.isActive("codeBlock"))}
				>
					Código
				</button>
				<button
					type="button"
					onClick={setLink}
					className={getButtonClass(editor.isActive("link"))}
				>
					Enlace
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().setHorizontalRule().run()
					}
					className="px-2 py-0.5 rounded transition-colors cursor-pointer text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
				>
					Línea
				</button>

				<span className="text-stone-300 self-center">|</span>

				{/* Multimedia */}
				<button
					type="button"
					onClick={addImageByUrl}
					className="px-2 py-0.5 rounded transition-colors cursor-pointer text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
				>
					Imagen (URL)
				</button>
				<label className="px-2 py-0.5 rounded transition-colors cursor-pointer text-stone-600 hover:bg-stone-200/60 hover:text-stone-900">
					Subir Archivo
					<input
						type="file"
						accept="image/*"
						onChange={addImageFromFile}
						className="hidden"
					/>
				</label>

				<span className="text-stone-300 self-center">|</span>

				{/* Botón para Limpiar Formato */}
				<button
					type="button"
					onClick={() =>
						editor
							.chain()
							.focus()
							.unsetAllMarks()
							.clearNodes()
							.run()
					}
					className="px-2 py-0.5 rounded transition-colors cursor-pointer text-stone-500 hover:bg-stone-200/60 hover:text-stone-900"
					title="Quitar todo el formato del texto seleccionado"
				>
					Limpiar
				</button>
			</div>

			{/* Área de Escritura */}
			<EditorContent editor={editor} />
		</div>
	);
}
