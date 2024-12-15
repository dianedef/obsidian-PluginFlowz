'use strict';

const { Plugin, PluginSettingTab, Setting, requestUrl, Notice, Modal, sanitizeHTMLToDom } = require('obsidian');

class RSSReaderPlugin extends Plugin {
   async onload() {



}
class RSSReaderSettingTab extends PluginSettingTab {
   constructor(app, plugin) {
      super(app, plugin);
      this.plugin = plugin;
   }
   display() {
      const {containerEl} = this;
      containerEl.empty();

      containerEl.createEl('h1', {text: this.plugin.t('settings.title')});

      new Setting(containerEl)
            .setName(this.plugin.t('settings.openaiKey.name'))
            .setDesc(this.plugin.t('settings.openaiKey.desc'))
            .addText(text => text
               .setPlaceholder('sk-...')
               .setValue(this.plugin.settings.openaiKey)
               .onChange(async (value) => {
                  this.plugin.settings.openaiKey = value;
                  await this.plugin.saveData(this.plugin.settings);
               }));

      new Setting(containerEl)
         .setName(this.plugin.t('settings.rssFolder.name'))
         .setDesc(this.plugin.t('settings.rssFolder.desc'))
         .addText(text => text
               .setValue(this.plugin.settings.rssFolder)
               .onChange(async (value) => {
                  this.plugin.settings.rssFolder = value;
                  await this.plugin.saveData(this.plugin.settings);
               }));

      new Setting(containerEl)
         .setName(this.plugin.t('settings.fetchFrequency.name'))
         .setDesc(this.plugin.t('settings.fetchFrequency.desc'))
         .addDropdown(dropdown => {
            dropdown.addOption('startup', this.plugin.t('settings.fetchFrequency.options.startup'));
            dropdown.addOption('daily', this.plugin.t('settings.fetchFrequency.options.daily'));
            dropdown.addOption('hourly', this.plugin.t('settings.fetchFrequency.options.hourly'));
            dropdown.setValue(this.plugin.settings.fetchFrequency)
               .onChange(async (value) => {
                  this.plugin.settings.fetchFrequency = value;
                  await this.plugin.saveData(this.plugin.settings);
               });
         })

      new Setting(containerEl)
         .setName(this.plugin.t('settings.maxArticles.name'))
         .setDesc(this.plugin.t('settings.maxArticles.desc'))
         .addText(text => text
               .setValue(String(this.plugin.settings.maxArticles))
               .onChange(async (value) => {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue > 0) {
                     this.plugin.settings.maxArticles = numValue;
                     await this.plugin.saveData(this.plugin.settings);
                     }
                  }
               ));

      new Setting(containerEl)
         .setName(this.plugin.t('settings.retentionDays.name'))
         .setDesc(this.plugin.t('settings.retentionDays.desc'))
         .addText(text => text
               .setValue(String(this.plugin.settings.retentionDays))
               .onChange(async (value) => {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue > 0) {
                     this.plugin.settings.retentionDays = numValue;
                     await this.plugin.saveData(this.plugin.settings);
                  }
               }));

      // Section Import/Export
      containerEl.createEl('h1', {text: this.plugin.t('settings.importExport.title')});
      
      new Setting(containerEl)
         .setName(this.plugin.t('settings.importExport.opmlImport.name'))
         .setDesc(this.plugin.t('settings.importExport.opmlImport.desc'))
         .addButton(button => button
            .setButtonText(this.plugin.t('settings.importExport.opmlImport.button'))
            .onClick(async () => {
               const input = document.createElement('input');
               input.type = 'file';
               input.accept = '.opml,.xml';
               input.style.display = 'none';
               containerEl.appendChild(input);

               input.onchange = async (e) => {
                  if (!e.target.files.length) return;
                  
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  
                  // Notification de début de chargement
                  const loadingNotice = new Notice(this.plugin.t('settings.importExport.opmlImport.loading'), 0);
                  
                  reader.onload = async (e) => {
                     try {
                        await this.plugin.importOpml(e.target.result);
                        loadingNotice.hide(); // Cacher la notification de chargement
                        new Notice(this.plugin.t('settings.importExport.opmlImport.success'));
                     } catch (error) {
                        loadingNotice.hide();
                        new Notice(this.plugin.t('settings.importExport.opmlImport.error'));
                        console.error(error);
                     } finally {
                        input.value = '';
                     }
                  };
                  reader.readAsText(file);
               };

               button
                  .setButtonText(this.plugin.t('settings.importExport.opmlImport.button'))
                  .onClick(() => {
                     input.click();
                  });
               
               return button;
            }));

      new Setting(containerEl)
         .setName(this.plugin.t('settings.importExport.opmlExport.name'))
         .setDesc(this.plugin.t('settings.importExport.opmlExport.desc'))
         .addButton(button => button
            .setButtonText(this.plugin.t('settings.importExport.opmlExport.button'))
            .onClick(async () => {
               const loadingNotice = new Notice(this.plugin.t('settings.importExport.opmlExport.loading'), 0);
               try {
                  await this.plugin.exportOpml();
                  loadingNotice.hide();
                  new Notice(this.plugin.t('settings.importExport.opmlExport.success'));
               } catch (error) {
                  loadingNotice.hide();
                  new Notice(this.plugin.t('settings.importExport.opmlExport.error'));
                  console.error(error);
               }
            }));

            new Setting(containerEl)
            .setName(this.plugin.t('settings.importExport.jsonImport.name'))
            .setDesc(this.plugin.t('settings.importExport.jsonImport.desc'))
            .addButton(button => {
               button
                  .setButtonText(this.plugin.t('settings.importExport.jsonImport.button'))
                  .onClick(() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.style.display = 'none';
                        containerEl.appendChild(input);

                        input.onchange = async (e) => {
                           if (!e.target.files.length) return;
                           
                           const loadingNotice = new Notice(this.plugin.t('settings.importExport.jsonImport.loading'), 0);
                           
                           try {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              
                              reader.onload = async (event) => {
                                    try {
                                       const config = JSON.parse(event.target.result);
                                       
                                       // Vérifier que le fichier contient les champs essentiels
                                       if (!config.feeds || !Array.isArray(config.groups)) {
                                          new Notice(this.plugin.t('settings.importExport.jsonImport.error'));
                                          return;
                                       }

                                       // Créer une sauvegarde de la configuration actuelle
                                       const backup = await this.plugin.loadData();
                                       const backupJson = JSON.stringify(backup, null, 2);
                                       const backupBlob = new Blob([backupJson], { type: 'application/json' });
                                       const backupUrl = window.URL.createObjectURL(backupBlob);
                                       const backupA = document.createElement('a');
                                       backupA.href = backupUrl;
                                       backupA.download = 'rss-reader-config-backup.json';
                                       backupA.click();
                                       window.URL.revokeObjectURL(backupUrl);

                                       // Appliquer la nouvelle configuration
                                       this.plugin.settings = Object.assign({}, this.plugin.settings, config);
                                       await this.plugin.saveData(this.plugin.settings);
                                       
                                       // Recréer les dossiers nécessaires
                                       await this.plugin.ensureFolder(this.plugin.settings.rssFolder);
                                       for (const group of this.plugin.settings.groups) {
                                          if (group !== this.plugin.t('settings.groups.none')) {
                                                await this.plugin.ensureFolder(`${this.plugin.settings.rssFolder}/${group}`);
                                          }
                                       }

                                       // Recréer les dossiers pour chaque feed non-unique
                                       for (const feed of this.plugin.settings.feeds) {
                                          if (feed.type !== 'uniqueFile') {
                                                const feedPath = `${this.plugin.settings.rssFolder}/${feed.group || ''}/${feed.title}`.replace(/\/+/g, '/');
                                                await this.plugin.ensureFolder(feedPath);
                                          }
                                       }

                                       new Notice(this.plugin.t('settings.importExport.jsonImport.success') + '\nUne sauvegarde a été créée');
                                       
                                       // Recharger l'interface des paramètres
                                       this.plugin.settings = await this.plugin.loadData();
                                       this.display();
                                       
                                    } catch (error) {
                                       console.error('Erreur lors du parsing:', error);
                                       new Notice(this.plugin.t('settings.importExport.jsonImport.error'));
                                    }
                              };
                              
                              reader.readAsText(file);
                           } catch (error) {
                              loadingNotice.hide();
                              new Notice(this.plugin.t('settings.importExport.jsonImport.error'));
                              console.error(error);
                           } finally {
                              input.value = '';
                           }
                        };

                        input.click();
                  });
               return button;
            });

      new Setting(containerEl)
         .setName(this.plugin.t('settings.importExport.jsonExport.name'))
         .setDesc(this.plugin.t('settings.importExport.jsonExport.desc'))
         .addButton(button => button
            .setButtonText(this.plugin.t('settings.importExport.jsonExport.button'))
            .onClick(async () => {
               const loadingNotice = new Notice(this.plugin.t('settings.importExport.jsonExport.loading'), 0);
               try {
                  const data = await this.plugin.loadData();
                  const jsonString = JSON.stringify(data, null, 2);
                  
                  const blob = new Blob([jsonString], { type: 'application/json' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'rss-flowz-config.json';
                  a.click();
                  window.URL.revokeObjectURL(url);
                  
                  loadingNotice.hide();
                  new Notice(this.plugin.t('settings.importExport.jsonExport.success'));
               } catch (error) {
                  loadingNotice.hide();
                  new Notice(this.plugin.t('settings.importExport.jsonExport.error'));
                  console.error(error);
               }
            }));

      containerEl.createEl('hr');

      // Section de gestion des groupes
      containerEl.createEl('h1', {text: this.plugin.t('settings.groups.title')});
      
      // Afficher les groupes existants
      this.plugin.settings.groups.forEach((group, index) => {
         if (group !== 'Sans groupe') {
            new Setting(containerEl)
               .setName(group)
               .addButton(button => button
                  .setButtonText(this.plugin.t('settings.groups.delete.button'))
                  .setWarning()
                  .onClick(async () => {
                     try {
                        const groupPath = `${this.plugin.settings.rssFolder}/${group}`;
                        
                        // Déplacer les feeds de ce groupe vers "Sans groupe"
                        this.plugin.settings.feeds.forEach(feed => {
                           if (feed.group === group) {
                              feed.group = '';
                           }
                        });
                        
                        // Supprimer le dossier et son contenu
                        await this.plugin.removeFolder(groupPath);
                        
                        // Supprimer le groupe des paramètres
                        this.plugin.settings.groups.splice(index, 1);
                        await this.plugin.saveData(this.plugin.settings);
                        
                        new Notice(this.plugin.t('settings.groups.delete.success') + ` : ${group}`);
                        this.display();
                     } catch (error) {
                        console.error(`Erreur lors de la suppression du groupe ${group}:`, error);
                        new Notice(this.plugin.t('settings.groups.delete.error'));
                     }
                  }));
         }
      });

      // Ajouter un nouveau groupe
      let inputText = '';
      new Setting(containerEl)
         .setName(this.plugin.t('settings.groups.add.name'))
         .setDesc(this.plugin.t('settings.groups.add.desc'))
         .addText(text => text
            .setPlaceholder(this.plugin.t('settings.groups.add.placeholder'))
            .setValue('')
            .onChange(value => {
               inputText = value;
            })
            .inputEl.addEventListener('keypress', async (e) => {
               if (e.key === 'Enter' && inputText.trim()) {
                  const groupName = inputText.trim();
                  if (!this.plugin.settings.groups.includes(groupName)) {
                     // Créer le dossier pour le nouveau groupe
                     await this.plugin.ensureFolder(`${this.plugin.settings.rssFolder}/${groupName}`);
                     
                     // Ajouter le groupe aux paramètres
                     this.plugin.settings.groups.push(groupName);
                     await this.plugin.saveData(this.plugin.settings);
                     new Notice(this.plugin.t('settings.groups.add.success') + ` : ${groupName}`);
                     this.display();
                  } else {
                     new Notice(this.plugin.t('settings.groups.add.error'));
                  }
               }
            }));


      containerEl.createEl('hr');
      containerEl.createEl('h1', {text: this.plugin.t('settings.feeds.title')});

      // Barre de recherche pour les feeds
      const searchContainer = containerEl.createDiv('search-container');
      const searchInput = searchContainer.createEl('input', {
         type: 'text',
         placeholder: this.plugin.t('settings.feeds.search.placeholder'),
         cls: 'feed-search-input'
      });

      // Container pour tous les feeds
      const feedsContainer = containerEl.createDiv('feeds-container');
      
      // Fonction pour filtrer et afficher les feeds
      const filterAndDisplayFeeds = (searchTerm = '') => {
         feedsContainer.empty();
         const groupedFeeds = {};
         
         this.plugin.settings.feeds
            .filter(feed => 
               feed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               feed.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (feed.group || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
            .forEach((feed, index) => {
               const group = feed.group || 'Sans groupe';
               if (!groupedFeeds[group]) {
                  groupedFeeds[group] = [];
               }
               groupedFeeds[group].push({feed, index});
            });

         Object.entries(groupedFeeds).forEach(([groupName, feeds]) => {
            if (groupName !== 'Sans groupe' || feeds.length > 0) {
               feedsContainer.createEl('h2', {text: groupName});
            }

            feeds.forEach(({feed, index}) => {
               const feedContainer = feedsContainer.createDiv('feed-container collapsed');
               const headerContainer = feedContainer.createDiv('feed-header');
               
               // Ajouter le titre du feed et son statut
               const titleContainer = headerContainer.createDiv('feed-title-container');
               titleContainer.createEl('span', { text: feed.title });
               
               // Ajouter une icône d'erreur si nécessaire
               if (feed.lastError) {
                  const errorIcon = titleContainer.createEl('span', { 
                      cls: 'feed-error-icon',
                      attr: {
                          'aria-label': `Dernière erreur: ${feed.lastError.message}\nLe ${new Date(feed.lastError.timestamp).toLocaleString()}`
                      }
                  });
                  errorIcon.innerHTML = '⚠️';
               }

               // Ajouter la date du dernier fetch réussi
               if (feed.lastSuccessfulFetch) {
                  const lastFetchSpan = titleContainer.createEl('span', {
                      cls: 'feed-last-fetch',
                      text: `Dernière mise à jour: ${new Date(feed.lastSuccessfulFetch).toLocaleString()}`
                  });
               }

               const optionsContainer = feedContainer.createDiv('feed-options');
               optionsContainer.style.display = 'none';

               // Créer un conteneur pour les boutons
               const buttonContainer = headerContainer.createDiv('feed-buttons');

               let toggleButton;

               // Fonction pour toggle le feed
               const toggleFeed = () => {
                  const isCollapsed = feedContainer.classList.contains('collapsed');
                  feedContainer.classList.toggle('collapsed');
                  optionsContainer.style.display = isCollapsed ? 'block' : 'none';
                  if (toggleButton) {
                     toggleButton.setIcon(isCollapsed ? 'chevron-up' : 'chevron-down');
                  }
               };

               // Ajouter les boutons dans leur conteneur
               new Setting(buttonContainer)
                  .addExtraButton(button => button
                     .setIcon(feed.status === 'active' ? 'check-circle' : 'circle')
                     .setTooltip(feed.status === 'active' ? 'Actif' : 'Pausé')
                     .onClick(async () => {
                        feed.status = feed.status === 'active' ? 'paused' : 'active';
                        await this.plugin.saveData(this.plugin.settings);
                        button.setIcon(feed.status === 'active' ? 'check-circle' : 'circle');
                        new Notice(`Feed ${feed.title} ${feed.status === 'active' ? 'activé' : 'pausé'}`);
                     }))
                  .addExtraButton(button => {
                     toggleButton = button;
                     button.setIcon('chevron-down')
                        .setTooltip('Afficher/Masquer les options')
                        .onClick(() => toggleFeed());
                     return button;
                  });

               // Rendre le header cliquable
               headerContainer.addEventListener('click', (event) => {
                  const target = event.target;
                  if (!target.closest('.feed-buttons')) {
                     toggleFeed();
                  }
               });

               // Options du feed
               new Setting(optionsContainer)
                  .setName(this.plugin.t('settings.feeds.options.saveType'))
                  .addDropdown(dropdown => {
                     // Ajouter d'abord une valeur par défaut
                     dropdown.addOption('multiple', this.plugin.t('settings.feeds.options.saveTypes.multiple'));
                     dropdown.addOption('single', this.plugin.t('settings.feeds.options.saveTypes.single'));
                     
                     // Définir la valeur actuelle (comme pour le groupe)
                     dropdown.setValue(feed.type || 'multiple');
                     
                     dropdown.onChange(async (value) => {
                        this.plugin.settings.feeds[index].type = value;
                        await this.plugin.saveData(this.plugin.settings);
                        new Notice(this.plugin.t('notices.settings.feedTypeChanged').replace('{title}', feed.title));
                     });
                  });

               // Ajouter un identifiant unique au container pour le retrouver après refresh
               feedContainer.setAttribute('data-feed-id', feed.url);

               // Options du feed
               new Setting(optionsContainer)
                  .setName('Groupe')
                  .addDropdown(dropdown => {
                     dropdown.addOption('', this.plugin.t('settings.feeds.group.none'));
                     this.plugin.settings.groups.forEach(g => 
                        dropdown.addOption(g, g)
                     );
                     dropdown.setValue(feed.group || '');
                     dropdown.onChange(async (value) => {
                        const oldGroup = feed.group || '';
                        const newGroup = value || '';
                        
                        try {
                           // Tous les chemins doivent partir du dossier RSS principal
                           const oldPath = oldGroup 
                              ? `${this.plugin.settings.rssFolder}/${oldGroup}` 
                              : this.plugin.settings.rssFolder;
                           const newPath = newGroup 
                              ? `${this.plugin.settings.rssFolder}/${newGroup}` 
                              : this.plugin.settings.rssFolder;
                           
                           // S'assurer que les dossiers nécessaires existent
                           await this.plugin.ensureFolder(this.plugin.settings.rssFolder);
                           if (newGroup) {
                              await this.plugin.ensureFolder(newPath);
                           }
                           
                           if (feed.type === 'uniqueFile') {
                              // Pour les fichiers uniques
                              const oldFilePath = `${oldPath}/${feed.title}.md`;
                              const newFilePath = `${newPath}/${feed.title}.md`;
                              
                              if (await this.app.vault.adapter.exists(oldFilePath)) {
                                 await this.app.vault.adapter.rename(oldFilePath, newFilePath);
                              }
                           } else {
                              // Pour les feeds multi-fichiers
                              const oldFeedFolder = `${oldPath}/${feed.title}`;
                              const newFeedFolder = `${newPath}/${feed.title}`;
                              
                              if (await this.app.vault.adapter.exists(oldFeedFolder)) {
                                 await this.plugin.ensureFolder(newFeedFolder);
                                 
                                 const files = await this.app.vault.adapter.list(oldFeedFolder);
                                 for (const file of files.files) {
                                    const fileName = file.split('/').pop();
                                    const newFilePath = `${newFeedFolder}/${fileName}`;
                                    await this.app.vault.adapter.rename(file, newFilePath);
                                 }
                                 
                                 // Supprimer l'ancien dossier
                                 await this.plugin.removeFolder(oldFeedFolder);
                              }
                           }
                           
                           // Mettre à jour les paramètres
                           this.plugin.settings.feeds[index].group = value;
                           await this.plugin.saveData(this.plugin.settings);
                           
                           this.display();
                           
                           const sourceFolder = oldGroup || this.plugin.t('settings.feeds.group.none');
                           const destinationFolder = newGroup || this.plugin.t('settings.feeds.group.none');
                           new Notice(`Feed ${feed.title} déplacé de "${sourceFolder}" vers "${destinationFolder}"`);
                        } catch (error) {
                           console.error('Erreur lors du déplacement des fichiers:', error);
                           new Notice(this.plugin.t('settings.feeds.group.error'));
                        }
                     });
                  });

               // Options avancées avec notifications
               new Setting(optionsContainer)
                  .setName(this.plugin.t('settings.feeds.summarize.name'))
                  .setDesc(this.plugin.t('settings.feeds.summarize.desc'))
                  .addToggle(toggle => toggle
                     .setValue(feed.summarize || false)
                     .onChange(async (value) => {
                        if (value && !this.plugin.settings.openaiKey) {
                           new Notice(this.plugin.t('settings.feeds.summarize.error'));
                           toggle.setValue(false);
                           return;
                        }
                        this.plugin.settings.feeds[index].summarize = value;
                        await this.plugin.saveData(this.plugin.settings);
                        new Notice(this.plugin.t('notices.settings.aiToggled')
                           .replace('{feature}', this.plugin.t('settings.feeds.summarize.name'))
                           .replace('{status}', value ? '✅' : '❌')
                           .replace('{title}', feed.title)
                        );
                     })
                  );

               new Setting(optionsContainer)
                  .setName(this.plugin.t('settings.feeds.rewrite.name'))
                  .setDesc(this.plugin.t('settings.feeds.rewrite.desc'))
                  .addToggle(toggle => toggle
                     .setValue(feed.rewrite || false)
                     .onChange(async (value) => {
                        if (value && !this.plugin.settings.openaiKey) {
                           new Notice(this.plugin.t('settings.feeds.rewrite.error'));
                           toggle.setValue(false);
                           return;
                        }
                        this.plugin.settings.feeds[index].rewrite = value;
                        await this.plugin.saveData(this.plugin.settings);
                        new Notice(this.plugin.t('notices.settings.aiToggled')
                           .replace('{feature}', this.plugin.t('settings.feeds.rewrite.name'))
                           .replace('{status}', value ? '✅' : '❌')
                           .replace('{title}', feed.title)
                        );
                     })
                  );

               new Setting(optionsContainer)
                  .setName(this.plugin.t('settings.feeds.transcribe.name'))
                  .setDesc(this.plugin.t('settings.feeds.transcribe.desc'))
                  .addToggle(toggle => toggle
                     .setValue(feed.transcribe || false)
                     .onChange(async (value) => {
                        if (value && !this.plugin.settings.openaiKey) {
                           new Notice(this.plugin.t('settings.feeds.transcribe.error'));
                           toggle.setValue(false);
                           return;
                        }
                        this.plugin.settings.feeds[index].transcribe = value;
                        await this.plugin.saveData(this.plugin.settings);
                        new Notice(this.plugin.t('notices.settings.aiToggled')
                           .replace('{feature}', this.plugin.t('settings.feeds.transcribe.name'))
                           .replace('{status}', value ? '✅' : '❌')
                           .replace('{title}', feed.title)
                        );
                     })
                  );

               new Setting(optionsContainer)
                  .addButton(button => button
                     .setButtonText(this.plugin.t('settings.feeds.delete.button'))
                     .setWarning()
                     .onClick(async () => {
                        this.plugin.settings.feeds.splice(index, 1);
                        await this.plugin.saveData(this.plugin.settings);
                        new Notice(this.t('notices.settings.feedDeleted')
                        .replace('{title}', feed.title)
                        );
                        filterAndDisplayFeeds(searchInput.value);
                  }));

            });
         });
      };

      // Initialiser l'affichage et configurer la recherche
      searchInput.addEventListener('input', () => {
         filterAndDisplayFeeds(searchInput.value);
      });
      filterAndDisplayFeeds();

      // Bouton d'ajout de feed
      new Setting(containerEl)
         .setName(this.plugin.t('settings.feeds.add.name'))
         .setDesc(this.plugin.t('settings.feeds.add.desc'))
         .addText(text => text
            .setPlaceholder(this.plugin.t('settings.feeds.add.placeholder'))
            .onChange(async (value) => {
               if (value) {
                  try {
                     // Vérifier si le feed existe déjà
                     const feedExists = this.plugin.settings.feeds.some(feed => 
                        feed.url.toLowerCase() === value.toLowerCase()
                     );

                     if (feedExists) {
                        new Notice(this.plugin.t('settings.feeds.add.error'));
                        return;
                     }

                     const response = await requestUrl({
                        url: value,
                        headers: {
                            'User-Agent': 'Mozilla/5.0',
                            'Accept': 'application/atom+xml,application/xml,text/xml,*/*'
                        }
                     });
                     
                     const parser = new DOMParser();
                     const doc = parser.parseFromString(response.text, 'text/xml');
                     
                     // Vérifier si c'est un feed valide
                     const isAtom = !!doc.querySelector('feed');
                     const isRss = !!doc.querySelector('rss, channel');
                     
                     if (!isAtom && !isRss) {
                        new Notice(this.plugin.t('settings.feeds.add.error'));
                        return;
                     }

                     const title = doc.querySelector('channel > title, feed > title')?.textContent || 'Nouveau feed';
                     
                     // Créer le nouveau feed
                     const newFeed = {
                        title: title,
                        url: value,
                        type: 'multiple',
                        status: 'active',
                        summarize: false,
                        transcribe: false,
                        tags: []
                     };

                     // Ajouter le feed aux settings
                     this.plugin.settings.feeds.push(newFeed);
                     await this.plugin.saveData(this.plugin.settings);

                     // Fetch immédiatement les articles
                     try {
                        new Notice(this.plugin.t('settings.feeds.add.fetching') + ` ${title}...`);
                        
                        let articles;
                        if (isAtom) {
                           articles = await this.plugin.parseAtomFeed(doc, newFeed);
                        } else {
                           articles = await this.plugin.parseRssFeed(doc, newFeed);
                        }

                        if (articles && articles.length > 0) {
                           await this.plugin.saveArticles(articles, newFeed);
                           new Notice(this.plugin.t('settings.feeds.add.success') + ` ${articles.length} articles récupérés pour ${title}`);
                        } else {
                           new Notice(this.plugin.t('settings.feeds.add.noArticles') + ` ${title}`);
                        }
                     } catch (fetchError) {
                        console.error('Erreur lors de la r��cupération des articles:', fetchError);
                        new Notice(this.plugin.t('settings.feeds.add.fetchError') + ` ${title}`);
                     }

                     // Rafraîchir l'interface
                     this.display();
                     new Notice(this.plugin.t('settings.feeds.add.success') + ` ${title}`);
                  } catch (error) {
                     console.error('Erreur lors de l\'ajout du feed:', error);
                     if (error.message.includes('CERT_')) {
                        new Notice(
                           this.plugin.t('settings.feeds.add.sslError')
                        );
                     } else {
                        new Notice(this.plugin.t('settings.feeds.add.error') + ` ${error.message}`);
                     }
                  }
               }
            })
         );

      // Ajouter un bouton pour supprimer tous les feeds
      new Setting(containerEl)
         .addButton(button => button
            .setButtonText(this.plugin.t('settings.feeds.deleteAll.button'))
            .setWarning()
            .onClick(async () => {
               const confirmation = await this.confirmDelete('tous les feeds');
               if (confirmation) {
                  this.plugin.settings.feeds = [];
                  await this.plugin.saveData(this.plugin.settings);
                  new Notice(this.plugin.t('settings.feeds.deleteAll.success'));
                  this.display();
               }
            }));
      };

   async confirmDelete(feedTitle) {
      return new Promise((resolve) => {
         const modal = new Modal(this.app);
         modal.titleEl.setText(this.plugin.t('settings.feeds.delete.confirm'));
         
         modal.contentEl.empty();
         modal.contentEl.createEl("p", { 
            text: this.plugin.t('settings.feeds.delete.confirmMessage').replace('{feedTitle}', feedTitle) 
         });

         new Setting(modal.contentEl)
            .addButton(btn => btn
               .setButtonText(this.plugin.t('settings.feeds.delete.cancel'))
               .onClick(() => {
                  modal.close();
                  resolve(false);
               }))
            .addButton(btn => btn
               .setButtonText(this.plugin.t('settings.feeds.delete.confirm'))
               .setWarning()
               .onClick(() => {
                  modal.close();
                  resolve(true);
               })
            );

         modal.open();
      });
   }

   async createNewGroup() {
      return new Promise((resolve) => {
         const modal = new Modal(this.app);
         modal.titleEl.setText(this.plugin.t('settings.feeds.group.add'));
         
         modal.contentEl.empty();
         const inputContainer = modal.contentEl.createDiv();
         const input = new Setting(inputContainer)
            .setName(this.plugin.t('settings.feeds.group.name'))
            .addText(text => text
               .setPlaceholder(this.plugin.t('settings.feeds.group.placeholder'))
               .setValue("")
            );

         new Setting(modal.contentEl)
            .addButton(btn => btn
               .setButtonText(this.plugin.t('settings.feeds.group.cancel'))
               .onClick(() => {
                  modal.close();
                  resolve(null);
               }))
            .addButton(btn => btn
               .setButtonText(this.plugin.t('settings.feeds.group.create'))
               .setCta()
               .onClick(() => {
                  const value = input.components[0].getValue().trim();
                  if (value) {
                     modal.close();
                     resolve(value);
                  } else {
                     new Notice(this.plugin.t('settings.feeds.group.error'));
                  }
               }));

         modal.open();
      });
   }
}


class ReadingModeModal extends Modal {
    constructor(app, article, groups, currentFolder, updateFeeds) {
        super(app);
        this.article = article;
        this.groups = groups;
        this.currentFolder = currentFolder;
        this.updateFeeds = updateFeeds;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.classList.add('reading-mode-active');

        // Ajouter le contenu de l'article
        const titleElement = document.createElement('h1');
        titleElement.textContent = this.article.title;
        contentEl.appendChild(titleElement);

        const contentElement = document.createElement('div');
        contentElement.innerHTML = this.article.content; // Assurez-vous que le contenu est sécurisé
        contentEl.appendChild(contentElement);

        // Créer la barre de contrôle
        const controlBar = document.createElement('div');
        controlBar.classList.add('reading-mode-controls');

        // Sélecteur de groupe
        const folderSelect = document.createElement('select');
        folderSelect.classList.add('reading-mode-select');
        this.groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.text = group;
            if (this.currentFolder === group) {
                option.selected = true;
            }
            folderSelect.appendChild(option);
        });
        folderSelect.addEventListener('change', (e) => {
            this.currentFolder = e.target.value;
            this.updateFeeds(this.currentFolder); // Mettre à jour les feeds
        });
        controlBar.appendChild(folderSelect);

        // Boutons de navigation
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '⬅️ Précédent';
        prevButton.onclick = () => this.navigateArticles('previous');
        controlBar.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Suivant ➡️';
        nextButton.onclick = () => this.navigateArticles('next');
        controlBar.appendChild(nextButton);

        // Ajouter un bouton pour fermer le modal
        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Fermer';
        closeButton.onclick = () => this.close();
        contentEl.appendChild(closeButton);

        // Ajouter la barre de contrôle au modal
        contentEl.appendChild(controlBar);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    navigateArticles(direction) {
        // Implémentez la logique pour naviguer entre les articles ici
        // Vous pouvez appeler une méthode de votre classe principale pour cela
    }
}

module.exports = RSSReaderPlugin; 